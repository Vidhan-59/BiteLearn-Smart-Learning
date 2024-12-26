import mongoengine as me
from datetime import datetime, timedelta


class User(me.Document):
    username = me.StringField(required=True, unique=True, max_length=100)
    email = me.EmailField(required=True, unique=True)
    password = me.StringField(required=True)
    contact_number = me.StringField(required=True, max_length=15)
    isverified = me.BooleanField(default=False)

    meta = {
        'collection': 'users',
        'indexes': ['username', 'email']
    }

class OTP(me.Document):
    email = me.EmailField(required=True)
    otp = me.StringField(required=True)
    created_at = me.DateTimeField(default=datetime.utcnow)
    expires_at = me.DateTimeField(default=lambda: datetime.utcnow() + timedelta(minutes=5))

    meta = {
        'collection': 'otps',
        'indexes': ['email', 'otp', 'expires_at']
    }

    def is_expired(self):
        return self.expires_at < datetime.utcnow()


class Token(me.Document):
    user = me.ReferenceField(User, required=True)
    key = me.StringField(required=True, unique=True)
    created_at = me.DateTimeField(default=datetime.utcnow)
    expires_at = me.DateTimeField(default=lambda: datetime.utcnow() + timedelta(days=7))  # Token valid for 7 days by default

    meta = {
        'collection': 'tokens'
    }

    def is_valid(self):
        return self.expires_at > datetime.utcnow() if self.expires_at else True


class Question(me.EmbeddedDocument):
    question = me.StringField(required=True)
    options = me.ListField(me.StringField(), required=True)
    answer = me.StringField(required=True)

class Video(me.Document):
    url = me.URLField(required=True)
    summary = me.StringField()
    questions = me.ListField(me.EmbeddedDocumentField(Question))
    user = me.ReferenceField(User, required=True)

    meta = {
        'collection': 'videos'
    }
class PDF(me.Document):
    file = me.FileField(required=True)  # Use FileField to handle PDF files
    summary = me.StringField()
    questions = me.ListField(me.EmbeddedDocumentField(Question))
    user = me.ReferenceField(User, required=True)

    meta = {
        'collection': 'pdfs'  # Ensure a different collection name to avoid conflicts
    }


# class UserAnswer(me.Document):
#     user = me.ReferenceField(User, required=True)
#     video = me.ReferenceField(Video, required=False)
#     pdf = me.ReferenceField(PDF, required=False)  # Use ReferenceField to handle PDFs associated with the video
#     question = me.StringField(required=True)  # Store the question text directly
#     selected_option = me.StringField()
#     is_correct = me.BooleanField()
#     is_attempted = me.BooleanField(default=False)
#     answered_at = me.DateTimeField(default=datetime.utcnow)
#
#     meta = {
#         'collection': 'user_answers'
#     }
#
#     def save(self, *args, **kwargs):
#         # Find the video associated with this answer
#         video = Video.objects.get(id=self.video.id)
#
#         # Find the correct answer by matching the question text within the video
#         question_data = next((q for q in video.questions if q.question == self.question), None)
#
#         if question_data:
#             correct_answer = question_data.answer
#             self.is_correct = (self.selected_option == correct_answer)
#             self.is_attempted = bool(self.selected_option)
#         else:
#             raise ValueError("Question not found in the video.")
#
#         super(UserAnswer, self).save(*args, **kwargs)
class UserAnswer(me.Document):
    user = me.ReferenceField(User, required=True)
    video = me.ReferenceField(Video, required=False)
    pdf = me.ReferenceField(PDF, required=False)
    question = me.StringField(required=True)
    selected_option = me.StringField()
    is_correct = me.BooleanField()
    is_attempted = me.BooleanField(default=False)
    answered_at = me.DateTimeField(default=datetime.utcnow)

    meta = {
        'collection': 'user_answers'
    }

    def save(self, *args, **kwargs):
        # Determine the source (Video or PDF) for the question
        if self.video:
            # Handle video-based question
            video = Video.objects.get(id=self.video.id)
            question_data = next((q for q in video.questions if q.question == self.question), None)

            if question_data:
                correct_answer = question_data.answer
                self.is_correct = (self.selected_option == correct_answer)
                self.is_attempted = bool(self.selected_option)
            else:
                raise ValueError("Question not found in the video.")
        elif self.pdf:
            # Handle PDF-based question
            pdf = PDF.objects.get(id=self.pdf.id)
            question_data = next((q for q in pdf.questions if q.question == self.question), None)

            if question_data:
                correct_answer = question_data.answer
                self.is_correct = (self.selected_option == correct_answer)
                self.is_attempted = bool(self.selected_option)
            else:
                raise ValueError("Question not found in the PDF.")
        else:
            raise ValueError("Either video or PDF must be provided.")

        super(UserAnswer, self).save(*args, **kwargs)

class UserScoreQuestion(me.Document):
    user = me.ReferenceField(User, required=True)
    total_correct_answer = me.IntField(required=True)
    total_wrong_answer = me.IntField(required=True)
    total_unattempted_question = me.IntField(required=True)
    total_question = me.IntField(required=True)
