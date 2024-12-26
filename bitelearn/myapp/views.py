
import os

import fitz
from django.http import HttpResponse
from requests import session
from weasel.util import download_file

from .serializers import RegisterSerializer, LoginSerializer, ProcessVideoSerializer, ValidateAnswerSerializer, \
    UserAnswerSerializer, ProcessPDFSerializer, UserScoreQuestionSerializer
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
from .models import User, Token, Video, UserAnswer, UserScoreQuestion, PDF
import uuid
import bcrypt
from datetime import datetime, timedelta
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from .models import User, OTP
from .serializers import RegisterSerializer, OTPSerializer, UserSerializer
import random
from django.core.mail import send_mail
from datetime import datetime
from rest_framework import status
from mongoengine import DoesNotExist
from .permissions import IsAuthenticatedUser


from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from googleapiclient.discovery import build
from .serializers import YouTubeVideoSerializer

from django.http import JsonResponse, HttpResponseBadRequest
from django.views.decorators.csrf import csrf_exempt
import json
from .audio_utils import download_audio
from .transcription_utils import transcribe_audio
from .text_processing_utils import generate_questions


class YouTubeRecommendationView(APIView):

    permission_classes = [IsAuthenticatedUser]
    api_key = "AIzaSyC18kWKuwhbLbwV7JIZOZMdVBY02i4-vr0"

    def search_videos(self, topic):
        youtube = build("youtube", "v3", developerKey=self.api_key)

        search_response = youtube.search().list(
            q=topic,
            part="snippet",
            type="video",
            maxResults=10
        ).execute()

        video_ids = [item['id']['videoId'] for item in search_response['items']]

        video_response = youtube.videos().list(
            id=','.join(video_ids),
            part='snippet,statistics'
        ).execute()

        videos = []
        for item in video_response['items']:
            description = item['snippet']['description']
            truncated_description = ' '.join(description.split()[:100])
            video_data = {
                "title": item['snippet']['title'],
                "description": truncated_description,
                "url": f'https://www.youtube.com/watch?v={item["id"]}',
                "views": int(item['statistics'].get('viewCount', 0)),
                "likes": int(item['statistics'].get('likeCount', 0))
            }
            videos.append(video_data)

        best_video = max(videos, key=lambda x: (x['likes'], x['views']))
        return best_video

    def post(self, request):
        topics = request.data.get("topics", [])
        print(topics)
        if not topics:
            return Response({"error": "No topics provided."}, status=status.HTTP_400_BAD_REQUEST)

        results = {}
        for topic in topics:
            best_video = self.search_videos(topic)
            results[topic] = best_video

        results_list = list(results.values())

        serializer = YouTubeVideoSerializer(data=results_list, many=True)
        if serializer.is_valid():
            print(results_list)  # Debugging output
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


from rest_framework.exceptions import AuthenticationFailed

class Loginuser(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        from .serializers import LoginSerializer
        serializer = LoginSerializer(data=request.data)

        if serializer.is_valid():
            username = serializer.validated_data['username']
            password = serializer.validated_data['password']
            print(username, password)  # Debugging output
            try:
                # Authenticate user
                user = User.objects.get(username=username)

                # Verify password
                if not bcrypt.checkpw(password.encode('utf-8'), user.password.encode('utf-8')):
                    raise AuthenticationFailed('Invalid credentials')

                # Check if the user is verified
                if not user.isverified:
                    # Resend OTP
                    otp_code = str(random.randint(100000, 999999))
                    OTP.objects.create(email=user.email, otp=otp_code)

                    # Send OTP via email
                    send_mail(
                        'Your OTP Code',
                        f'Your OTP code is {otp_code}. It will expire in 5 minutes.',
                        'Dungeon0559@gmail.com',
                        [user.email],
                        fail_silently=False,
                    )

                    return Response({
                        'message': 'Your account is not verified. A new OTP has been sent to your email.',
                        'email': user.email
                    }, status=401)

                # Generate a new token key
                token_key = str(uuid.uuid4())

                # Try to find an existing token for the user
                token = Token.objects(user=user).first()

                if token:
                    # Update the existing token
                    token.key = token_key
                    token.expires_at = datetime.utcnow() + timedelta(days=7)  # Reset expiration to 7 days
                    token.save()
                else:
                    # Create a new token
                    token = Token(
                        user=user,
                        key=token_key,
                        expires_at=datetime.utcnow() + timedelta(days=7)  # Set expiration to 7 days
                    )
                    token.save()

                # Set the token in the response headers
                response = Response({
                    'message': 'Login successful',
                    'name' : user.username,
                }, status=200)
                response['Authorization'] = f'Token {token.key}'
                return response

            except User.DoesNotExist:
                raise AuthenticationFailed('Invalid credentials')
        else:
            return Response(serializer.errors, status=400)

class ResendOTPView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        employee_id = request.data.get('user_id')

        # Debugging: print received employee_id
        print("Received employee_id:", employee_id)

        if not employee_id:
            return Response({'error': 'User ID not provided'}, status=400)

        try:
            # Fetch user based on employee_id
            user = User.objects.get(id=employee_id)
        except User.DoesNotExist:
            return Response({'error': 'User does not exist'}, status=404)

        if user.isverified:
            return Response({'message': 'User is already verified'}, status=400)

        otp_code = str(random.randint(100000, 999999))
        OTP.objects(email=user.email).delete()
        OTP.objects.create(email=user.email, otp=otp_code)

        send_mail(
            'Your OTP Code',
            f'Your OTP code is {otp_code}. It will expire in 5 minutes.',
            'Dungeon0559@gmail.com',
            [user.email],
            fail_silently=False,
        )

        return Response({'message': 'A new OTP has been sent to your email'}, status=200)



class RegisterUserView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if not serializer.is_valid():
            return Response({'error': serializer.errors}, status=400)

        data = serializer.validated_data

        if User.objects(email=data['email']).first() or User.objects(contact_number=data['contact_number']).first():
            return Response({'error': 'User with this email or contact number already exists'}, status=409)

        hashed_password = bcrypt.hashpw(data['password'].encode('utf-8'), bcrypt.gensalt())

        # Storing user data in session
        request.session['email'] = data['email']
        request.session['username'] = data['username']  # Ensure username is stored
        request.session.save()

        # Debugging: print session data
        print("Session Data After Save:", dict(request.session))

        user = User(
            email=data['email'],
            contact_number=data['contact_number'],
            username=data['username'],
            password=hashed_password.decode('utf-8'),
            isverified=False
        )
        user.save()

        otp_code = str(random.randint(100000, 999999))
        OTP.objects.create(email=data['email'], otp=otp_code)

        send_mail(
            'Your OTP Code',
            f'Your OTP code is {otp_code}. It will expire in 5 minutes.',
            'Dungeon0559@gmail.com',
            [data['email']],
            fail_silently=False,
        )

        return Response({
            'message': 'Registration successful. Please verify your email with the OTP sent to you.',
            'user_id': str(user.id)  # Assuming user.id is an ObjectId and needs to be converted to a string
        }, status=201)
class VerifyOTPAndRegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = OTPSerializer(data=request.data)
        if not serializer.is_valid():
            return Response({'error': 'Invalid OTP or email'}, status=400)

        data = serializer.validated_data
        otp_record = OTP.objects(email=data['email'], otp=data['otp']).first()

        if not otp_record or otp_record.is_expired():
            return Response({'error': 'Invalid or expired OTP'}, status=400)

        # Remove the OTP after successful verification
        OTP.objects(email=data['email']).delete()

        # Mark the user as verified
        user = User.objects(email=data['email']).first()
        if not user:
            return Response({'error': 'User not found'}, status=404)

        user.isverified = True
        user.save()

        return Response({'message': 'Email verified successfully. You can now log in.'}, status=200)



class ProcessVideoView(APIView):
    permission_classes = [IsAuthenticatedUser]

    def post(self, request):
        serializer = ProcessVideoSerializer(data=request.data)
        if serializer.is_valid():
            video_url = serializer.validated_data['video_url']
            print(video_url)
            output_directory = serializer.validated_data['output_directory']

            if not video_url:
                return Response({"error": "Missing 'video_url' in request."}, status=status.HTTP_400_BAD_REQUEST)

            try:
                # Download and transcribe audio
                mp3_filename = download_audio(video_url, output_directory)
                print('here')
                import time
                time.sleep(2)
                if mp3_filename:
                    audio_path = os.path.join(output_directory, mp3_filename)
                    transcription = transcribe_audio(audio_path)


                    summary, questions = generate_questions(transcription)


                    os.remove(audio_path)


                    user = request.user


                    video = Video(
                        url=video_url,
                        summary=summary,
                        questions=[{"question": q["question"], "options": q["options"], "answer": q["answer"]} for q in questions],
                        user=user
                    )
                    video.save()

                    # Return the video ID along with the summary and questions
                    return Response({
                        "video_id": str(video.id),  # Include the video ID in the response
                        "summary": summary,
                        "questions": questions
                    }, status=status.HTTP_200_OK)
                else:
                    return Response({"error": "Failed to download audio."}, status=status.HTTP_400_BAD_REQUEST)
            except Exception as e:
                return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



class ProcessPDFView(APIView):
    permission_classes = [IsAuthenticatedUser]

    def post(self, request):
        serializer = ProcessPDFSerializer(data=request.data)
        if serializer.is_valid():
            pdf_file = serializer.validated_data['pdf_file']
            output_directory = serializer.validated_data['output_directory']

            if not pdf_file:
                return Response({"error": "Missing 'pdf_file' in request."}, status=status.HTTP_400_BAD_REQUEST)

            try:
                # Ensure output directory exists
                if not os.path.exists(output_directory):
                    os.makedirs(output_directory)

                # Save the file
                pdf_path = os.path.join(output_directory, pdf_file.name)
                with open(pdf_path, 'wb+') as destination:
                    for chunk in pdf_file.chunks():
                        destination.write(chunk)

                # Process the PDF
                pdf_text = self.process_pdf(pdf_path)
                if pdf_text:
                    # Generate questions from PDF text
                    summary, questions = generate_questions(pdf_text)

                    # Get the authenticated user
                    user = request.user

                    # Save the PDF data with generated questions in the database
                    pdf = PDF(
                        summary=summary,
                        questions=[{"question": q["question"], "options": q["options"], "answer": q["answer"]} for q in questions],
                        user=user
                    )
                    pdf.save()

                    # Return the PDF ID along with the summary and questions
                    return Response({
                        "file_id": str(pdf.id),  # Include the PDF ID in the response
                        "summary": summary,
                        "questions": questions
                    }, status=status.HTTP_200_OK)
                else:
                    return Response({"error": "Failed to extract text from PDF."}, status=status.HTTP_400_BAD_REQUEST)

            except Exception as e:
                return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def process_pdf(self, pdf_path):
        try:
            # Implement PDF processing logic
            pdf_text = self.extract_text_from_pdf(pdf_path)
            if pdf_text is None:
                raise ValueError("Failed to extract text from PDF.")
            return pdf_text
        except Exception as e:
            raise ValueError(f"Error processing PDF: {e}")

    def extract_text_from_pdf(self, pdf_path):
        import fitz  # PyMuPDF
        try:
            # Open the PDF file
            doc = fitz.open(pdf_path)
            all_text = ""

            # Iterate through all the pages
            for page_num in range(len(doc)):
                page = doc.load_page(page_num)
                text = page.get_text("text")
                if text.strip():
                    all_text += f"Page {page_num + 1}:\n{text}\n"

            return all_text
        except Exception as e:
            raise ValueError(f"Error extracting text from PDF: {e}")



class ValidateAnswerView(APIView):
    def post(self, request):
        serializer = ValidateAnswerSerializer(data=request.data)
        if serializer.is_valid():
            question = serializer.validated_data['question']
            selected_option = serializer.validated_data['selected_option']
            correct_answer = serializer.validated_data['correct_answer']

            if selected_option == correct_answer:
                return Response({"result": "Correct!"}, status=status.HTTP_200_OK)
            else:
                return Response({"result": "Incorrect. Try again!"}, status=status.HTTP_200_OK)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# class SubmitAnswerView(APIView):
#     permission_classes = [IsAuthenticatedUser]
#
#     def post(self, request):
#         serializer = UserAnswerSerializer(data=request.data)
#         if serializer.is_valid():
#             results, score_data = serializer.save()
#
#             # Save the score to the UserScoreQuestion model
#             user = request.user
#             UserScoreQuestion.objects.create(
#                 user=user,
#                 total_correct_answer=score_data['total_correct'],
#                 total_wrong_answer=score_data['total_wrong'],
#                 total_unattempted_question=score_data['total_unattempted'],
#                 total_question=score_data['total_questions']
#             )
#
#             return Response(results, status=status.HTTP_201_CREATED)
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
class SubmitAnswerView(APIView):
    permission_classes = [IsAuthenticatedUser]

    def post(self, request):
        serializer = UserAnswerSerializer(data=request.data)
        if serializer.is_valid():
            results, score_data = serializer.save()

            # Save or update the score in the UserScoreQuestion model
            user = request.user
            print(user.username)
            try:
                # Try to find the existing score entry for the user
                score_entry = UserScoreQuestion.objects.get(user=user)

                # Update the existing entry by adding new scores to the old ones
                score_entry.total_correct_answer += score_data['total_correct']
                score_entry.total_wrong_answer += score_data['total_wrong']
                score_entry.total_unattempted_question += score_data['total_unattempted']
                score_entry.total_question += score_data['total_questions']

                # Save the updated entry
                score_entry.save()

            except DoesNotExist:
                # Create a new entry if it doesn't exist
                score_entry = UserScoreQuestion(
                    user=user,
                    total_correct_answer=score_data['total_correct'],
                    total_wrong_answer=score_data['total_wrong'],
                    total_unattempted_question=score_data['total_unattempted'],
                    total_question=score_data['total_questions']
                )
                score_entry.save()
                print("ok")

            # Add the score details to the response
            response_data = {
                "results": results["results"],  # Detailed question-by-question results
                "score": results["score"]       # Score data for the current test
            }

            return Response(response_data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



class GetResultsView(APIView):
    permission_classes = [IsAuthenticatedUser]

    def get(self, request, video_id):
        user = request.user
        video = Video.objects.get(id=video_id)
        questions = video.questions
        user_answers = UserAnswer.objects.filter(user=user, video=video)

        # Create a dictionary to map questions to user answers
        user_answer_dict = {answer.question: answer for answer in user_answers}

        result_data = {
            'questions': []
        }

        for question in questions:
            user_answer = user_answer_dict.get(question.question)
            result_data['questions'].append({
                'question': question.question,
                'options': question.options,
                'user_answer': user_answer.selected_option if user_answer else None,
                'is_correct': user_answer.is_correct if user_answer else None
            })

        result_data.update({
            'correct_answers': user_answers.filter(is_correct=True).count(),
            'wrong_answers': user_answers.filter(is_correct=False, is_attempted=True).count(),
            'not_attempted': user_answers.filter(is_attempted=False).count(),
            'total_questions': len(questions)
        })

        return Response(result_data, status=status.HTTP_200_OK)

class GetPDFResultsView(APIView):
    permission_classes = [IsAuthenticatedUser]

    def get(self, request, pdf_id):
        user = request.user
        pdf = PDF.objects.get(id=pdf_id)
        answers = UserAnswer.objects.filter(user=user, pdf=pdf)

        correct_answers = answers.filter(is_correct=True).count()
        wrong_answers = answers.filter(is_correct=False, is_attempted=True).count()
        not_attempted = answers.filter(is_attempted=False).count()

        result_data = {
            'correct_answers': correct_answers,
            'wrong_answers': wrong_answers,
            'not_attempted': not_attempted,
            'total_questions': answers.count()
        }

        return Response(result_data, status=status.HTTP_200_OK)

from django.utils.translation import gettext_lazy as _
from django.utils import timezone
# class UserProgressView(APIView):
#     permission_classes = [IsAuthenticatedUser]
#
#     def get(self, request):
#         # Extract the token from the Authorization header
#         auth_header = request.headers.get('Authorization')
#
#         if not auth_header:
#             raise AuthenticationFailed(_('Authentication credentials were not provided.'))
#
#         try:
#             # Token is typically in the format 'Token <token_key>', so split it
#             token_key = auth_header.split(' ')[1]
#         except IndexError:
#             raise AuthenticationFailed(_('Invalid token format.'))
#
#         # Retrieve the token document from the MongoDB database using mongoengine
#         token = Token.objects(key=token_key).first()
#
#         if not token:
#             raise AuthenticationFailed(_('Invalid or expired token.'))
#
#         # # Check if the token has expired
#         # if token.expires_at < timezone.now():
#         #     raise AuthenticationFailed(_('Token has expired.'))
#         # Fetch the score data for the authenticated user
#
#         try:
#             user_scores = UserScoreQuestion.objects.get(user=token.user)
#         except UserScoreQuestion.DoesNotExist:
#             return Response({"error": "No score data found for this user."}, status=status.HTTP_404_NOT_FOUND)
#
#         # Serialize the score data
#         serializer = UserScoreQuestionSerializer(user_scores)
#
#         return Response(serializer.data, status=status.HTTP_200_OK)

class UserProgressView(APIView):
    permission_classes = [IsAuthenticatedUser]

    def get(self, request):
        # Extract the token from the Authorization header
        auth_header = request.headers.get('Authorization')

        if not auth_header:
            raise AuthenticationFailed(_('Authentication credentials were not provided.'))

        try:
            # Token is typically in the format 'Token <token_key>', so split it
            token_key = auth_header.split(' ')[1]
        except IndexError:
            raise AuthenticationFailed(_('Invalid token format.'))

        # Retrieve the token document from the MongoDB database using mongoengine
        token = Token.objects(key=token_key).first()

        if not token:
            raise AuthenticationFailed(_('Invalid or expired token.'))

        # Check if the token has expired
        # if token.expires_at < timezone.now():
        #     raise AuthenticationFailed(_('Token has expired.'))

        # Fetch user details
        user = token.user

        # Fetch and count video and PDF requests
        video_requests = Video.objects(user=user)
        pdf_requests = PDF.objects(user=user)

        video_count = video_requests.count()
        pdf_count = pdf_requests.count()

        # Gather video URLs and PDF names
        video_urls = [video.url for video in video_requests]
        # pdf_names = [pdf.file.name for pdf in pdf_requests]

        # Fetch the score data for the authenticated user
        try:
            user_scores = UserScoreQuestion.objects.get(user=user)
        except UserScoreQuestion.DoesNotExist:
            user_scores = None

        # Serialize the score data if available
        if user_scores:
            serializer = UserScoreQuestionSerializer(user_scores)
            score_data = serializer.data
        else:
            score_data = {"error": "No score data found for this user."}

        # Prepare user details
        user_details = {
            'username': user.username,
            'email': user.email,
            'contact_number': user.contact_number,
            'is_verified': user.isverified,
            'video_request_count': video_count,
            'video_urls': video_urls,
            'pdf_request_count': pdf_count,
            # 'pdf_names': pdf_names,
            'score_data': score_data,
        }

        return Response(user_details, status=status.HTTP_200_OK)