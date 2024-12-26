
from django.urls import path
from django.conf.urls.static import static
from bitelearn import settings
from . import views
urlpatterns = [
    path('signup/', views.RegisterUserView.as_view()),
    path('verify-otp/', views.VerifyOTPAndRegisterView.as_view()),
    path('login/', views.Loginuser.as_view()),
    path('resend/', views.ResendOTPView.as_view()),
    path('recommendations/', views.YouTubeRecommendationView.as_view()),
    path('upload/video/', views.ProcessVideoView.as_view(), name='process-video'),
    path('upload/pdf/', views.ProcessPDFView.as_view(), name='process-pdf'),
    path('submit_answer/', views.SubmitAnswerView.as_view(), name='submit_answer'),
    path('get_results/<str:video_id>/', views.GetResultsView.as_view(), name='get_results'),
    path('get_results/<str:pdf_id>/', views.GetPDFResultsView.as_view(), name='get_results'),
    path('progress/' , views.UserProgressView.as_view(), name='progress'),
]+ static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)