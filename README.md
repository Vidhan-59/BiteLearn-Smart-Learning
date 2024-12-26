# BiteLearn

BiteLearn is a comprehensive educational platform designed to enhance learning experiences by leveraging state-of-the-art machine learning models from Hugging Face. This project, developed as a part of a second-year academic curriculum, focuses on generating questions and multiple-choice options from video and PDF content. Additionally, it provides personalized topic-based recommendations and tracks user progress with a detailed record of their learning journey.

## Features

1. **Question Generation**
   - Extracts content from YouTube videos and PDF files.
   - Utilizes Hugging Face ML models to generate questions and multiple-choice options based on the extracted content.

2. **Topic-Based Recommendations**
   - Analyzes the content to recommend related topics and resources for further study.

3. **User Progress Tracking**
   - Tracks user activity and progress.
   - Maintains a detailed record of all user interactions, including completed tasks, scores, and past learning history.

4. **Modern Web Application**
   - Built with Django for the backend and React Vite for the frontend.
   - Seamless integration of REST APIs for efficient communication between the backend and frontend.
   - Responsive and user-friendly UI designed with Tailwind CSS.

## Tech Stack

### Backend
- Django: For building the backend API.
- MongoEngine: For database interactions.
- Hugging Face Transformers: For ML-based question generation.
- PyMuPDF (fitz): For handling PDF processing.

### Frontend
- React Vite: For building the frontend application.
- Tailwind CSS: For responsive and modern UI styling.

### Database
- MongoDB: For storing user data, progress records, and generated questions.

## Installation and Setup

### Prerequisites
- Python (>=3.9)
- Node.js (>=16.x)
- MongoDB (>=5.0)

### Backend Setup

1. Clone the repository:
   \`\`\`
   git clone https://github.com/Vidhan-59/BiteLearn-Smart-Learning
   cd bitelearn/backend
   \`\`\`

2. Create a virtual environment and activate it:
   \`\`\`
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   \`\`\`

3. Install dependencies:
   \`\`\`
   pip install -r requirements.txt
   \`\`\`

4. Start the Django server:
   \`\`\`
   python manage.py runserver
   \`\`\`

### Frontend Setup

1. Navigate to the frontend directory:
   \`\`\`
   cd bitelearn/frontend
   \`\`\`

2. Install dependencies:
   \`\`\`
   npm install
   \`\`\`

3. Start the development server:
   \`\`\`
   npm run dev
   \`\`\`

### Database Configuration

1. Ensure MongoDB is running locally or configure the connection string in the Django settings file.

2. Run database migrations (if applicable):
   \`\`\`
   python manage.py makemigrations
   python manage.py migrate
   \`\`\`

## Usage

1. Upload a YouTube video URL or PDF file on the home page.
2. Generate questions and options using the "Generate Questions" feature.
3. View personalized topic-based recommendations based on the uploaded content.
4. Track your progress and view detailed records of your learning journey.

## API Documentation

The complete API documentation is available on Postman:
[BiteLearn API Documentation](https://documenter.getpostman.com/view/34400094/2sAXjM5sY6#cba69c4c-0376-42b0-bd3c-efa4b925f8ed)

This documentation includes detailed information about all available endpoints, request/response formats, and authentication requirements.


## Future Enhancements

- Add support for more file formats (e.g., Word documents, ePub).
- Implement advanced analytics for deeper insights into user progress.
- Integrate a chatbot for real-time assistance.

## Contributing

Contributions are welcome! Please fork the repository and submit a pull request for review.


## Acknowledgements

- Hugging Face for providing powerful ML models.
- PyMuPDF for PDF processing.
- Mentors and peers for their support throughout this project.

