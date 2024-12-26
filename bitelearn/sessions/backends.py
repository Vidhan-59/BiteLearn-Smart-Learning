import mongoengine
from django.contrib.sessions.backends.base import SessionBase, CreateError
from django.utils import timezone
import datetime

# Define the MongoDB session model
class MongoSession(mongoengine.Document):
    session_key = mongoengine.StringField(max_length=40, unique=True)
    session_data = mongoengine.BinaryField()
    expire_date = mongoengine.DateTimeField()

    meta = {
        'collection': 'django_sessions',
        'indexes': [
            {'fields': ['expire_date'], 'expireAfterSeconds': 0},
        ],
    }

# Define the session store class
class SessionStore(SessionBase):
    def load(self):
        try:
            session = MongoSession.objects.get(session_key=self.session_key)
            if session.expire_date < timezone.now():
                self.delete()
                return {}
            return self.decode(session.session_data)
        except MongoSession.DoesNotExist:
            return {}

    def create(self):
        self.session_key = self._get_new_session_key()
        self.save(must_create=True)

    def save(self, must_create=False):
        session_data = self.encode(self._get_session(no_load=True))
        expire_date = timezone.now() + datetime.timedelta(weeks=2)  # Set session expiration to 2 weeks
        if must_create:
            MongoSession.objects.create(
                session_key=self.session_key,
                session_data=session_data.encode('utf-8'),  # Encode session data to bytes
                expire_date=expire_date
            )
        else:
            MongoSession.objects.filter(session_key=self.session_key).update(
                set__session_data=session_data.encode('utf-8'),  # Encode session data to bytes
                set__expire_date=expire_date
            )

    def delete(self, *args, **kwargs):
        MongoSession.objects.filter(session_key=self.session_key).delete()

    def exists(self, session_key):
        return MongoSession.objects.filter(session_key=session_key).exists()
