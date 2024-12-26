# from django.db import models
# from django.contrib.auth.models import AbstractUser

# # Custom User model extending Django's AbstractUser
# class CustomUser(AbstractUser):
#     first_name = models.CharField(max_length=50)
#     last_name = models.CharField(max_length=50)
#     email = models.EmailField(unique=True)
#     date_of_birth = models.DateField(null=True, blank=True)
#     gender = models.CharField(max_length=10, choices=[('M', 'Male'), ('F', 'Female'), ('O', 'Other')], null=True, blank=True)
#     profile_photo = models.ImageField(upload_to='profiles/', null=True, blank=True)

#     def __str__(self):
#         return self.username

# # Hospital model to store hospital information
# class Hospital(models.Model):
#     name = models.CharField(max_length=255)
#     address = models.TextField()
#     photo = models.ImageField(upload_to='hospital_photos/', null=True, blank=True)

#     def __str__(self):
#         return self.name

# # Doctor model linked to CustomUser, but only users with is_doctor=True can be doctors
# class Doctor(models.Model):
#     user = models.OneToOneField(CustomUser, on_delete=models.CASCADE)
#     license_number = models.CharField(max_length=50, unique=True)
#     years_of_experience = models.PositiveIntegerField()
#     qualification = models.CharField(max_length=255)
#     hospital = models.ForeignKey(Hospital, on_delete=models.CASCADE)

#     def __str__(self):
#         return f'Dr. {self.user.first_name} {self.user.last_name}'

# # Appointment Slot model to store time slots for appointments
# class AppointmentSlot(models.Model):
#     doctor = models.ForeignKey(Doctor, on_delete=models.CASCADE)
#     start_time = models.DateTimeField()
#     price = models.DecimalField(max_digits=10, decimal_places=2)
#     status = models.CharField(max_length=20, choices=[('available', 'Available'), ('booked', 'Booked')], default='available')

#     def __str__(self):
#         return f'Appointment with {self.doctor} at {self.start_time}'

# # Appointment model to store actual appointments
# class Appointment(models.Model):
#     appointment_slot = models.ForeignKey(AppointmentSlot, on_delete=models.CASCADE)
#     user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)

#     def __str__(self):
#         return f'Appointment for {self.user} with {self.appointment_slot.doctor}'

# # Appointment History model to store appointment records
# class AppointmentHistory(models.Model):
#     user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='appointment_history')
#     doctor = models.ForeignKey(Doctor, on_delete=models.CASCADE, related_name='appointment_history')
#     price = models.DecimalField(max_digits=10, decimal_places=2)
#     date = models.DateTimeField()

#     def __str__(self):
#         return f'Appointment history of {self.user} with {self.doctor} on {self.date}'

# # Prescription model linked to an appointment history
# class Prescription(models.Model):
#     appointment_history = models.ForeignKey(AppointmentHistory, on_delete=models.CASCADE)
#     notes = models.TextField()

#     def __str__(self):
#         return f'Prescription for appointment history ID {self.appointment_history.id}'

# # Medication Master model to store information about medicines
# from django.db import models

# class MedicationMaster(models.Model):
#     # Enum for Dosage Form
#     class DosageFormChoices(models.TextChoices):
#         CREAM = 'Cream', 'Cream'
#         INJECTION = 'Injection', 'Injection'
#         OINTMENT = 'Ointment', 'Ointment'
#         SYRUP = 'Syrup', 'Syrup'
#         TABLET = 'Tablet', 'Tablet'
#         INHALER = 'Inhaler', 'Inhaler'
#         CAPSULE = 'Capsule', 'Capsule'
#         DROPS = 'Drops', 'Drops'
    
#     # Enum for Indication
#     class IndicationChoices(models.TextChoices):
#         VIRUS = 'Virus', 'Virus'
#         INFECTION = 'Infection', 'Infection'
#         WOUND = 'Wound', 'Wound'
#         PAIN = 'Pain', 'Pain'
#         FUNGUS = 'Fungus', 'Fungus'
#         DIABETES = 'Diabetes', 'Diabetes'
#         DEPRESSION = 'Depression', 'Depression'
#         FEVER = 'Fever', 'Fever'

#     name = models.CharField(max_length=255)
#     category = models.CharField(max_length=255)
    
#     # Use the choices feature for dosage form
#     dosage_form = models.CharField(
#         max_length=50,
#         choices=DosageFormChoices.choices,
#         default=DosageFormChoices.TABLET  # Default to 'Tablet'
#     )

#     strength = models.CharField(max_length=50)  # e.g., 500mg
#     manufacturer = models.CharField(max_length=255)
    
#     # Use the choices feature for indication
#     indication = models.CharField(
#         max_length=50,
#         choices=IndicationChoices.choices,
#         default=IndicationChoices.PAIN  # Default to 'Pain'
#     )
    
#     classification = models.CharField(max_length=255)  # e.g., Antibiotic

#     def __str__(self):
#         return self.name

# # pip install django-multiselectfield
# # install this first

# # Medicine Prescription model linking prescriptions to medicines
# from django.db import models
# from multiselectfield import MultiSelectField

# class MedicinePrescription(models.Model):
#     # Enum for frequency
#     class FrequencyChoices(models.TextChoices):
#         MORNING = 'Morning', 'Morning'
#         AFTERNOON = 'Afternoon', 'Afternoon'
#         EVENING = 'Evening', 'Evening'
#         NIGHT = 'Night', 'Night'
    
#     prescription = models.ForeignKey(Prescription, on_delete=models.CASCADE, related_name='medicines')
#     medicine = models.ForeignKey(MedicationMaster, on_delete=models.CASCADE)
#     dosage = models.CharField(max_length=100)
    
#     # Frequency of medication, limited to morning, afternoon, evening, night
#     frequency = models.CharField(
#         max_length=50,
#         choices=FrequencyChoices.choices,
#         default=FrequencyChoices.MORNING
#     )
    
#     # Use MultiSelectField for 'when' field, allowing multiple times to be selected
#     WHEN_CHOICES = [
#         ('Morning', 'Morning'),
#         ('Afternoon', 'Afternoon'),
#         ('Evening', 'Evening'),
#         ('Night', 'Night'),
#     ]
#     when = MultiSelectField(choices=WHEN_CHOICES, null=True, blank=True)

#     def __str__(self):
#         return f'{self.medicine.name} prescribed in {self.prescription.id}'



from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.decorators import login_required
from django.contrib.auth.hashers import make_password
from django.contrib.auth import authenticate, login
from django.contrib import messages
from .models import CustomUser, Hospital, Doctor, AppointmentSlot, Appointment, AppointmentHistory, Prescription, MedicationMaster, MedicinePrescription

# User Signup
def signup(request):
    if request.method == 'POST':
        first_name = request.POST.get('first_name')
        last_name = request.POST.get('last_name')
        email = request.POST.get('email')
        username = request.POST.get('username')
        password = request.POST.get('password')
        confirm_password = request.POST.get('confirm_password')
        date_of_birth = request.POST.get('date_of_birth')
        gender = request.POST.get('gender')

        if password != confirm_password:
            messages.error(request, 'Passwords do not match.')
            return render(request, 'signup.html')

        if CustomUser.objects.filter(username=username).exists():
            messages.error(request, 'Username already taken.')
            return render(request, 'signup.html')

        if CustomUser.objects.filter(email=email).exists():
            messages.error(request, 'Email already exists.')
            return render(request, 'signup.html')

        # Create the user
        user = CustomUser.objects.create(
            first_name=first_name,
            last_name=last_name,
            email=email,
            username=username,
            password=make_password(password),
            date_of_birth=date_of_birth,
            gender=gender
        )
        user.save()

        messages.success(request, 'User created successfully. Please login.')
        return redirect('login')

    return render(request, 'signup.html')


# User Login
def user_login(request):
    if request.method == 'POST':
        username = request.POST.get('username')
        password = request.POST.get('password')
        user = authenticate(username=username, password=password)

        if user is not None:
            login(request, user)
            return redirect('dashboard')  # Redirect to user dashboard
        else:
            messages.error(request, 'Invalid username or password.')
            return render(request, 'login.html')

    return render(request, 'login.html')


# Add Hospital
@login_required
def add_hospital(request):
    if request.method == 'POST':
        name = request.POST.get('name')
        address = request.POST.get('address')
        photo = request.FILES.get('photo')

        hospital = Hospital.objects.create(
            name=name,
            address=address,
            photo=photo
        )
        hospital.save()

        messages.success(request, 'Hospital added successfully.')
        return redirect('hospital_list')  # Redirect to hospital list

    return render(request, 'add_hospital.html')


# Add Doctor
@login_required
def add_doctor(request):
    if request.method == 'POST':
        user = request.user  # Current logged-in user
        if not user.is_authenticated:
            messages.error(request, 'You need to log in to add a doctor.')

        license_number = request.POST.get('license_number')
        years_of_experience = request.POST.get('years_of_experience')
        qualification = request.POST.get('qualification')
        hospital_id = request.POST.get('hospital')

        hospital = get_object_or_404(Hospital, id=hospital_id)

        doctor = Doctor.objects.create(
            user=user,
            license_number=license_number,
            years_of_experience=years_of_experience,
            qualification=qualification,
            hospital=hospital
        )
        doctor.save()

        messages.success(request, 'Doctor added successfully.')
        return redirect('doctor_list')  # Redirect to doctor list

    hospitals = Hospital.objects.all()  # Fetch hospitals for the dropdown
    return render(request, 'add_doctor.html', {'hospitals': hospitals})


# Add Appointment Slot
@login_required
def add_appointment_slot(request):
    if request.method == 'POST':
        doctor_id = request.POST.get('doctor')
        start_time = request.POST.get('start_time')
        price = request.POST.get('price')

        doctor = get_object_or_404(Doctor, id=doctor_id)

        slot = AppointmentSlot.objects.create(
            doctor=doctor,
            start_time=start_time,
            price=price
        )
        slot.save()

        messages.success(request, 'Appointment slot created successfully.')
        return redirect('appointment_slots_list')  # Redirect to appointment slots list

    doctors = Doctor.objects.all()
    return render(request, 'add_appointment_slot.html', {'doctors': doctors})


# Book Appointment
@login_required
def book_appointment(request):
    if request.method == 'POST':
        slot_id = request.POST.get('slot')
        slot = get_object_or_404(AppointmentSlot, id=slot_id)

        appointment = Appointment.objects.create(
            appointment_slot=slot,
            user=request.user
        )
        appointment.save()

        messages.success(request, 'Appointment booked successfully.')
        return redirect('appointment_list')  # Redirect to appointment list

    slots = AppointmentSlot.objects.filter(status='available')
    return render(request, 'book_appointment.html', {'slots': slots})


# Add Prescription
@login_required
def add_prescription(request):
    if request.method == 'POST':
        appointment_history_id = request.POST.get('appointment_history')
        notes = request.POST.get('notes')

        appointment_history = get_object_or_404(AppointmentHistory, id=appointment_history_id)

        prescription = Prescription.objects.create(
            appointment_history=appointment_history,
            notes=notes
        )
        prescription.save()

        messages.success(request, 'Prescription added successfully.')
        return redirect('prescription_list')  # Redirect to prescription list

    appointment_histories = AppointmentHistory.objects.all()  # Fetch appointment histories for dropdown
    return render(request, 'add_prescription.html', {'appointment_histories': appointment_histories})


# Add Medication Prescription
@login_required
def add_medication_prescription(request):
    if request.method == 'POST':
        prescription_id = request.POST.get('prescription')
        medicine_id = request.POST.get('medicine')
        dosage = request.POST.get('dosage')
        frequency = request.POST.get('frequency')
        when = request.POST.getlist('when')  # Multiple values for "when"

        prescription = get_object_or_404(Prescription, id=prescription_id)
        medicine = get_object_or_404(MedicationMaster, id=medicine_id)

        medication_prescription = MedicinePrescription.objects.create(
            prescription=prescription,
            medicine=medicine,
            dosage=dosage,
            frequency=frequency,
            when=when
        )
        medication_prescription.save()

        messages.success(request, 'Medication prescription added successfully.')
        return redirect('medication_prescription_list')  # Redirect to medication prescription list

    prescriptions = Prescription.objects.all()
    medicines = MedicationMaster.objects.all()
    return render(request, 'add_medication_prescription.html', {'prescriptions': prescriptions, 'medicines': medicines})

