import re
import bcrypt
from rest_framework import serializers
from .models import *
import bson
from rest_framework import serializers
from .models import User
from django.contrib.auth.hashers import make_password
from .models import User  # Adjust the import according to your app structure


class UserSerializer(serializers.Serializer):
    username = serializers.CharField(max_length=100)
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)
    contact_number = serializers.CharField(max_length=15)


class OTPSerializer(serializers.Serializer):
    email = serializers.EmailField()
    otp = serializers.CharField()


class RegisterSerializer(serializers.Serializer):
    username = serializers.CharField(max_length=100)
    email = serializers.EmailField()
    password = serializers.CharField(max_length=100)
    contact_number = serializers.CharField(max_length=15)

    def validate(self, data):

        if User.objects(username=data['username']).first():
            raise serializers.ValidationError("Username already exists")

        if User.objects(email=data['email']).first():
            raise serializers.ValidationError("Email already exists")

        password = data['password']
        if len(password) < 6:
            raise serializers.ValidationError("Password must be at least 6 characters long")
        if not re.search(r'\d', password):
            raise serializers.ValidationError("Password must contain at least one number")
        if not re.search(r'[!@#$%^&*(),.?":{}|<>]', password):
            raise serializers.ValidationError("Password must contain at least one special character")

        contact_number = data['contact_number']
        if not re.fullmatch(r'\d{10,15}', contact_number):
            raise serializers.ValidationError("Contact number must be between 10 and 15 digits long")

        return data


class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField()

    def validate(self, data):
        username = data.get('username')
        password = data.get('password')

        # Authenticate user
        try:
            user = User.objects.get(username=username)
            print(user.username)
        except:
            raise serializers.ValidationError("Invalid username or password.")

        # Check if the password is correct
        if not bcrypt.checkpw(password.encode('utf-8'), user.password.encode('utf-8')):
            raise serializers.ValidationError("Invalid username or password.")

        return data


class YouTubeVideoSerializer(serializers.Serializer):
    title = serializers.CharField(max_length=255)
    description = serializers.CharField(max_length=1900)
    url = serializers.URLField()
    views = serializers.IntegerField()
    likes = serializers.IntegerField()


# this is for model
class ProcessVideoSerializer(serializers.Serializer):
    video_url = serializers.URLField()
    output_directory = serializers.CharField(
        required=False,
        default='C:\\Users\\Vidha\\OneDrive\\Desktop\\DSA\\model_1\\bitelearn\\myapp\\download'
    )
class ProcessPDFSerializer(serializers.Serializer):
    pdf_file = serializers.FileField()
    output_directory = serializers.CharField(
        required=False,
        default='C:\\Users\\Vidha\\OneDrive\\Desktop\\DSA\\model_1\\bitelearn\\myapp\\download'
    )

class ValidateAnswerSerializer(serializers.Serializer):
    question = serializers.CharField()
    selected_option = serializers.CharField()
    correct_answer = serializers.CharField()

class QuestionSerializer(serializers.Serializer):
    question = serializers.CharField()
    options = serializers.ListField(child=serializers.CharField())
    answer = serializers.CharField()

class VideoSerializer(serializers.Serializer):
    url = serializers.URLField()
    summary = serializers.CharField()
    questions = QuestionSerializer(many=True)
    # user = serializers.PrimaryKeyRelatedField(queryset=User.objects.all())


class AnswerSerializer(serializers.Serializer):
    question = serializers.CharField()
    selected_option = serializers.CharField(allow_blank=True, required=False)
from rest_framework import serializers
from .models import UserAnswer, Video, PDF

class UserAnswerSerializer(serializers.Serializer):
    video = serializers.CharField(required=False, allow_blank=True)
    pdf = serializers.CharField(required=False, allow_blank=True)
    answers = AnswerSerializer(many=True)

    def validate(self, data):
        video_id = data.get('video')
        pdf_id = data.get('pdf')

        if not video_id and not pdf_id:
            raise serializers.ValidationError("Either 'video' or 'pdf' must be provided.")

        # if video_id and pdf_id:
        #     raise serializers.ValidationError("Only one of 'video' or 'pdf' should be provided, not both.")

        return data

    def create(self, validated_data):
        video_id = validated_data.get('video')
        pdf_id = validated_data.get('pdf')
        answers_data = validated_data['answers']

        # Determine whether to use Video or PDF
        if video_id:
            instance = Video.objects.get(id=video_id)
            user = instance.user
        elif pdf_id:
            instance = PDF.objects.get(id=pdf_id)
            user = instance.user
        else:
            raise serializers.ValidationError("Either 'video' or 'pdf' must be provided.")

        total_questions = len(instance.questions)
        total_correct = 0
        total_wrong = 0
        total_unattempted = 0

        results = []
        for answer_data in answers_data:
            question_text = answer_data['question']
            selected_option = answer_data.get('selected_option', '')

            # Find the correct answer by matching the question text within the instance
            question_data = next((q for q in instance.questions if q.question == question_text), None)

            if not question_data:
                raise serializers.ValidationError(f"Question '{question_text}' not found in the instance.")

            correct_answer = question_data.answer
            is_correct = (selected_option == correct_answer) if selected_option else False
            is_attempted = bool(selected_option)

            if is_attempted:
                if is_correct:
                    total_correct += 1
                else:
                    total_wrong += 1
            else:
                total_unattempted += 1

            user_answer = UserAnswer(
                user=user,
                video=instance if isinstance(instance, Video) else None,
                pdf=instance if isinstance(instance, PDF) else None,
                question=question_text,
                selected_option=selected_option,
                is_attempted=is_attempted,
                is_correct=is_correct
            )
            user_answer.save()

            results.append({
                "question": question_text,
                "selected_option": selected_option,
                "correct_answer": correct_answer,  # Added correct_answer to the response
                "is_correct": is_correct,
                "is_attempted": is_attempted,
                "answered_at": user_answer.answered_at
            })

        score_data = {
            "total_correct": total_correct,
            "total_wrong": total_wrong,
            "total_unattempted": total_unattempted,
            "total_questions": total_questions
        }

        # Return results along with score for the current test
        return {
            "results": results,
            "score": {
                "total_correct": total_correct,
                "total_questions": total_questions
            }
        }, score_data


class UserScoreQuestionSerializer(serializers.Serializer):
    user = serializers.PrimaryKeyRelatedField(queryset=User.objects.all())
    total_correct_answer = serializers.CharField()
    total_wrong_answer = serializers.CharField()
    total_unattempted_question = serializers.CharField()
    total_question = serializers.CharField()

    def to_representation(self, instance):
        representation = super().to_representation(instance)

        # Convert fields to string
        representation['user'] = str(representation['user'])
        representation['total_correct_answer'] = str(representation['total_correct_answer'])
        representation['total_wrong_answer'] = str(representation['total_wrong_answer'])
        representation['total_unattempted_question'] = str(representation['total_unattempted_question'])
        representation['total_question'] = str(representation['total_question'])

        return representation

    def to_internal_value(self, data):
        # Ensure fields are parsed as needed
        data['user'] = str(data.get('user'))
        data['total_correct_answer'] = int(data.get('total_correct_answer', 0))
        data['total_wrong_answer'] = int(data.get('total_wrong_answer', 0))
        data['total_unattempted_question'] = int(data.get('total_unattempted_question', 0))
        data['total_question'] = int(data.get('total_question', 0))

        return super().to_internal_value(data)

