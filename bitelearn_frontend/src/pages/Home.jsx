// import { useState } from 'react';
// import { useNavigate } from "react-router-dom";
// import { Button } from '../components/ui/Button';
// import { Input } from '../components/ui/Input';
// import { Label } from '../components/ui/Label';
// import { Tabs, TabsList, TabsTrigger, TabsContent } from '../components/ui/Tabs';
// import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../components/Card';
// import { BookOpen } from 'lucide-react';
// import Cookies from 'js-cookie';
// import { RadioGroup, RadioGroupItem } from '../components/ui/RadioGroup';
// import { ExternalLink, ThumbsUp, Eye } from 'lucide-react'
// import { Badge } from '../components/ui/Badge';
// import Progress from '../components/ui/Progress';
// const Home = () => {
//   const [videoUrl, setVideoUrl] = useState('');
//   const [pdfFile, setPdfFile] = useState(null);
//   const [topic, setTopic] = useState('');
//   const [recommendations, setRecommendations] = useState([]);
//   const [questions, setQuestions] = useState([]);
//   const [userAnswers, setUserAnswers] = useState({});
//   const [videoId, setVideoId] = useState(''); // State to store video_id
//   const [error, setError] = useState(""); // To hold error messages
//   const [quizResults, setQuizResults] = useState(null);
//   const navigate = useNavigate();
//   const handleVideoSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const token = Cookies.get('auth_token');
//       console.log(token)
//       if (!token) {
//         console.log("here")
//         setError("You are not allowed to access this page. Redirecting to signup...");
//         setTimeout(() => {
//           navigate("/signup"); // Redirect after 2 seconds
//         }, 2000);
//         return;
//       }
//       const response = await fetch('http://localhost:8000/api/upload/video/', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${token}`
//         },
//         body: JSON.stringify({ video_url: videoUrl })
//       });
  
//       if (!response.ok) {
//         throw new Error('Network response was not ok.');
//       }
  
//       const data = await response.json();
//       console.log('Backend response:', data); // Log the response to check its structure
//       setQuestions(data.questions);
//       setVideoId(data.video_id); // Set the video ID from the response
//     } catch (error) {
//       console.error('Error fetching video questions:', error);
//     }
//   };

//   const handlePdfSubmit = (e) => {
//     e.preventDefault();
//     console.log('PDF file submitted:', pdfFile);
//   };

//   const handleRecommendationSubmit = async (e) => {
//     e.preventDefault();

//     if (!topic.trim()) {
//       alert('Please enter at least one topic.');
//       return;
//     }

//     try {
//       const topicsArray = topic.split(',').map(t => t.trim()).filter(t => t.length > 0);
//       const token = Cookies.get('auth_token');
//       if (!token) {
//         setError("You are not allowed to access this page. Redirecting to signup...");
//         setTimeout(() => {
//           navigate("/signup"); // Redirect after 2 seconds
//         }, 2000);
//         return;
//       }
//       const response = await fetch('http://localhost:8000/api/recommendations/', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${token}`
//         },
//         body: JSON.stringify({ topics: topicsArray })
//       });

//       if (!response.ok) {
//         throw new Error('Network response was not ok.');
//       }

//       const data = await response.json();
//       setRecommendations(data);
//     } catch (error) {
//       console.error('Error fetching recommendations:', error);
//     }
//   };

//   const handleAnswerChange = (questionIndex, selectedOption) => {
//     setUserAnswers(prevAnswers => ({
//       ...prevAnswers,
//       [questions[questionIndex].question]: selectedOption
//     }));
//   };

//   const handleQuizSubmit = async (e) => {
//     e.preventDefault();

//     if (!videoId) {
//       alert('Please submit a video first.');
//       return;
//     }

//     try {
//       const formattedAnswers = questions.map((q) => ({
//         question: q.question,
//         selected_option: userAnswers[q.question] || '',
//       }));

//       const response = await fetch('http://localhost:8000/api/submit_answer/', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${Cookies.get('auth_token')}`,
//         },
//         body: JSON.stringify({
//           video: videoId,
//           answers: formattedAnswers,
//         }),
//       });

//       if (!response.ok) {
//         throw new Error('Network response was not ok.');
//       }

//       const resultData = await response.json();
//       setQuizResults(resultData); // Save the results returned from the backend
//       alert('Quiz submitted successfully!');
//     } catch (error) {
//       console.error('Error submitting quiz:', error);
//       setError('An error occurred while submitting the quiz.');
//     }
//   };

//   const calculatePercentage = () => {
//     if (!quizResults || !quizResults.score) return 0;
//     return (quizResults.score.total_correct / quizResults.score.total_questions) * 100;
//   };

//   const percentage = calculatePercentage();


//   return (
//     <div className="min-h-screen bg-gradient-to-b from-blue-100 to-white">
//       <header className="bg-white shadow">
//         <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
//           <h1 className="text-3xl font-bold text-gray-900 flex items-center">
//             <BookOpen className="mr-2 h-8 w-8 text-blue-500" />
//             Bitelearn
//           </h1>
//           <nav>
//             <Button variant="ghost">About</Button>
//             <Button variant="ghost">Contact</Button>
//             <Button variant="outline">Login</Button>
//           </nav>
//         </div>
//       </header>

//       <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
//         <div className="px-4 py-6 sm:px-0">
//           <h2 className="text-2xl font-semibold text-gray-900 mb-6">Welcome to Bitelearn</h2>
//           <p className="text-lg text-gray-700 mb-8">Enhance your learning experience with our AI-powered question generation tools.</p>

//           <Tabs defaultValue="video">
//             {(activeTab, setActiveTab) => (
//               <>
//                 <TabsList>
//                   <TabsTrigger value="video" setActiveTab={setActiveTab}>Video Questions</TabsTrigger>
//                   <TabsTrigger value="pdf" setActiveTab={setActiveTab}>PDF Questions</TabsTrigger>
//                   <TabsTrigger value="recommendations" setActiveTab={setActiveTab}>Get Recommendations</TabsTrigger>
//                 </TabsList>
//                 <TabsContent value="video" activeTab={activeTab}>
//                   <Card>
//                     <CardHeader>
//                       <CardTitle>Generate Questions from Video</CardTitle>
//                       <CardDescription>Enter a YouTube video URL to get questions and answers.</CardDescription>
//                     </CardHeader>
//                     <CardContent>
//                       <form onSubmit={handleVideoSubmit}>
//                         <Label htmlFor="videoUrl">YouTube Video URL</Label>
//                         <Input
//                           id="videoUrl"
//                           placeholder="https://www.youtube.com/watch?v=..."
//                           value={videoUrl}
//                           onChange={(e) => setVideoUrl(e.target.value)}
//                         />
//                         <Button type="submit" className="mt-4">Generate Questions</Button>
//                       </form>
//                     </CardContent>
//                     <CardFooter className="flex justify-between">
//                       <Button variant="outline" onClick={() => setVideoUrl('')}>Clear</Button>
//                     </CardFooter>
//                   </Card>

//                   {questions.length > 0 && (
//                     <Card className="mt-8">
//                       <CardHeader>
//                         <CardTitle>Quiz</CardTitle>
//                         <CardDescription>Answer the questions below.</CardDescription>
//                       </CardHeader>
//                       <CardContent>
//                         <form onSubmit={handleQuizSubmit}>
//                           {questions.map((q, index) => (
//                             <div key={index} className="mb-8 last:mb-0">
//                               <p className="font-semibold mb-3 text-lg">
//                                 {index + 1}. {q.question}
//                               </p>
//                               <RadioGroup
//                                 value={userAnswers[q.question] || ""}
//                                 onValueChange={(value) => handleAnswerChange(index, value)}
//                                 className="space-y-2"
//                               >
//                                 {q.options.map((option, optionIndex) => (
//                                   <RadioGroupItem
//                                     key={optionIndex}
//                                     value={option}
//                                     id={`question-${index}-option-${optionIndex}`}
//                                   >
//                                     {option}
//                                   </RadioGroupItem>
//                                 ))}
//                               </RadioGroup>
//                             </div>
//                           ))}
//                           <Button type="submit">Submit Quiz</Button>
//                         </form>
//                         {quizResults && (
//   <div className="mt-8">
//     <h3 className="text-xl font-semibold">Results</h3>
//     <Progress value={percentage} className="mt-4">
//       {percentage.toFixed(2)}%
//     </Progress>
//     {quizResults.results.map((result, index) => (
//       <Card key={index} className="mt-4">
//         <CardContent>
//           <p className="font-semibold">
//             Question {index + 1}: {result.question}
//           </p>
//           <p className={`mt-1 text-sm ${result.is_correct ? 'text-green-500' : 'text-red-500'}`}>
//             Your answer: {result.selected_option}
//           </p>
//           {!result.is_correct && (
//             <p className="mt-1 text-sm text-red-500">Correct answer: {result.correct_answer}</p>
//           )}
//         </CardContent>
//       </Card>
//     ))}
//   </div>
// )}
//                       </CardContent>
//                     </Card>
//                   )}
//                 </TabsContent>
//                 <TabsContent value="pdf" activeTab={activeTab}>
//                   <Card>
//                     <CardHeader>
//                       <CardTitle>Generate Questions from PDF</CardTitle>
//                       <CardDescription>Upload a PDF file to get questions and answers.</CardDescription>
//                     </CardHeader>
//                     <CardContent>
//                       <form onSubmit={handlePdfSubmit}>
//                         <Label htmlFor="pdfFile">Upload PDF</Label>
//                         <Input
//                           type="file"
//                           id="pdfFile"
//                           onChange={(e) => setPdfFile(e.target.files[0])}
//                         />
//                         <Button type="submit" className="mt-4">Generate Questions</Button>
//                       </form>
//                     </CardContent>
//                     <CardFooter className="flex justify-between">
//                       <Button variant="outline" onClick={() => setPdfFile(null)}>Clear</Button>
//                     </CardFooter>
//                   </Card>
//                 </TabsContent>
//                 <TabsContent value="recommendations" activeTab={activeTab}>
//                   <Card>
//                     <CardHeader>
//                       <CardTitle>Get Personalized Recommendations</CardTitle>
//                       <CardDescription>Enter topics of interest to get tailored recommendations.</CardDescription>
//                     </CardHeader>
//                     <CardContent>
//                       <form onSubmit={handleRecommendationSubmit}>
//                         <Label htmlFor="topic">Topics (comma separated)</Label>
//                         <Input
//                           id="topic"
//                           placeholder="e.g., AI, Machine Learning"
//                           value={topic}
//                           onChange={(e) => setTopic(e.target.value)}
//                         />
//                         <Button type="submit" className="mt-4">Get Recommendations</Button>
//                       </form>
//                     </CardContent>
//                     <CardFooter className="flex justify-between">
//                       <Button variant="outline" onClick={() => setTopic('')}>Clear</Button>
//                     </CardFooter>
//                   </Card>

//                   <div className="max-w-4xl mx-auto p-4">
//       {recommendations.length > 0 && (
//       <Card className="mt-8 bg-gradient-to-b from-blue-100 to-white">
//         <CardHeader>
//           <CardTitle className="text-2xl font-bold">Recommended Videos</CardTitle>
//         </CardHeader>
//         <CardContent>
//           <ul className="space-y-6">
//             {recommendations.map((rec, index) => (
//               <li 
//                 key={index} 
//                 className="bg-white shadow-md rounded-lg overflow-hidden transition-all duration-300 hover:shadow-xl"
//               >
//                 <div className="p-6">
//                   <h3 className="font-semibold text-xl mb-2 text-blue-600">{rec.title}</h3>
//                   <p className="text-gray-600 mb-4">{rec.description}</p>
//                   <div className="flex items-center justify-between">
//                     <div className="flex items-center space-x-4">
//                       <Badge variant="secondary" className="flex items-center space-x-1">
//                         <Eye className="w-4 h-4" />
//                         <span>{rec.views.toLocaleString()}</span>
//                       </Badge>
//                       <Badge variant="secondary" className="flex items-center space-x-1">
//                         <ThumbsUp className="w-4 h-4" />
//                         <span>{rec.likes.toLocaleString()}</span>
//                       </Badge>
//                     </div>
//                     <Button asChild>
//                       <a 
//                         href={rec.url} 
//                         target="_blank" 
//                         rel="noopener noreferrer"
//                         className="flex items-center space-x-2"
//                       >
//                         <span>Watch Video</span>
//                         <ExternalLink className="w-4 h-4" />
//                       </a>
//                     </Button>
//                   </div>
//                 </div>
//               </li>
//             ))}
//           </ul>
//           </CardContent>
//         </Card>
//       )}
//     </div>
//                 </TabsContent>
//               </>
//             )}
//           </Tabs>
//         </div>
//       </main>
//     </div>
//   );
// };

// export default Home;



















import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Home() {
  const [videoUrl, setVideoUrl] = useState('');
  const [pdfFile, setPdfFile] = useState(null);
  const [topic, setTopic] = useState('');
  const [recommendations, setRecommendations] = useState([]);
  const [videoquestions, setvideoQuestions] = useState([]);
  const [pdfquestions, setpdfQuestions] = useState([]);
  const [userAnswers, setUserAnswers] = useState({});
  const [videoId, setVideoId] = useState('');
  const [pdfId, setpdfId] = useState('');
  const [error, setError] = useState('');
  const [videoquizResults, setvideoQuizResults] = useState(null);
  const [pdfquizResults, setPdfquizResults] = useState(null);
  const [username, setUsername] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('video');
  const navigate = useNavigate();

  useEffect(() => {
    const savedUsername = Cookies.get('username');
    if (savedUsername) {
      setUsername(savedUsername);
    }
  }, []);

  const handleLogin = () => {
    navigate('/login');
  };

  const handleVideoSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setVideoId('');
    setpdfId('');
    setvideoQuestions([]);
    setvideoQuizResults(null);
    try {
      const token = Cookies.get('auth_token');
      if (!token) {
        toast.error('You are not allowed to access this page. Redirecting to signup...', {
          position: "top-center",
          autoClose: 2000,
        });
        setTimeout(() => {
          window.location.href = '/login';
        }, 2000);
        return;
      }

      const response = await fetch('http://localhost:8000/api/upload/video/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ video_url: videoUrl })
      });

      if (!response.ok) {
        throw new Error('Network response was not ok.');
      }

      const data = await response.json();
      setvideoQuestions(data.questions);
      setVideoId(data.video_id);
      setUserAnswers({});
    } catch (error) {
      console.error('Error fetching video questions:', error);
      setError('An error occurred while fetching video questions.');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePdfSubmit = async (e) => {
    e.preventDefault();
    if (!pdfFile) {
      toast.error('Please select a PDF file to upload.');
      return;
    }
    
    setIsLoading(true);
    try {
      const token = Cookies.get('auth_token');
      setpdfId('');
      setVideoId('');
      setpdfQuestions([]);
      setPdfquizResults(null);
      if (!token) {
        toast.error('You are not allowed to access this page. Redirecting to signup...', {
          position: "top-center",
          autoClose: 2000,
        });
        setTimeout(() => {
          window.location.href = '/login';
        }, 2000);
        return;
      }

      const formData = new FormData();
      formData.append('pdf_file', pdfFile);

      const response = await fetch('http://localhost:8000/api/upload/pdf/', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (!response.ok) {
        throw new Error('Network response was not ok.');
      }

      const data = await response.json();
      setpdfQuestions(data.questions);
      setpdfId(data.file_id);
      setUserAnswers({});
    } catch (error) {
      console.error('Error uploading PDF:', error);
      setError('An error occurred while uploading the PDF.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRecommendationSubmit = async (e) => {
    e.preventDefault();

    if (!topic.trim()) {
      toast.error('Please enter at least one topic.');
      return;
    }

    try {
      const topicsArray = topic.split(',').map(t => t.trim()).filter(t => t.length > 0);
      const token = Cookies.get('auth_token');
      if (!token) {
        setError("You are not allowed to access this page. Redirecting to signup...");
        setTimeout(() => {
          navigate("/signup");
        }, 2000);
        return;
      }
      const response = await fetch('http://localhost:8000/api/recommendations/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ topics: topicsArray })
      });

      if (!response.ok) {
        throw new Error('Network response was not ok.');
      }

      const data = await response.json();
      setRecommendations(data);
    } catch (error) {
      console.error('Error fetching recommendations:', error);
      setError('An error occurred while fetching recommendations.');
    }
  };

  const handleAnswerChange = (questionIndex, selectedOption) => {
    if (pdfId && pdfquestions && pdfquestions[questionIndex]) {
      setUserAnswers(prevAnswers => ({
        ...prevAnswers,
        [pdfquestions[questionIndex].question]: selectedOption
      }));
    } else if (videoId && videoquestions && videoquestions[questionIndex]) {
      setUserAnswers(prevAnswers => ({
        ...prevAnswers,
        [videoquestions[questionIndex].question]: selectedOption
      }));
    } else {
      console.error("Invalid questionIndex or missing data for questions.");
    }
  };

  const handleQuizSubmit = async (e) => {
    e.preventDefault();
  
    if (!videoId && !pdfId) {
      toast.error('Please submit a video or PDF first.');
      return;
    }
  
    try {
      const formattedAnswers = (pdfId ? pdfquestions : videoquestions).map((q) => ({
        question: q.question,
        selected_option: userAnswers[q.question] || '',
      }));
  
      const requestBody = {
        answers: formattedAnswers,
        ...(pdfId ? { pdf: pdfId } : { video: videoId })
      };
  
      const response = await fetch('http://localhost:8000/api/submit_answer/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${Cookies.get('auth_token')}`,
        },
        body: JSON.stringify(requestBody),
      });
  
      if (!response.ok) {
        throw new Error('Network response was not ok.');
      }
  
      const resultData = await response.json();
  
      if (pdfId) {
        setPdfquizResults(resultData);
      } else {
        setvideoQuizResults(resultData);
      }
  
      toast.success('Quiz submitted successfully!');
    } catch (error) {
      console.error('Error submitting quiz:', error);
      setError('An error occurred while submitting the quiz.');
    }
  };

  const calculatePercentage = () => {
    if (pdfId) {
      if (!pdfquizResults || !pdfquizResults.score) return 0;
      return (pdfquizResults.score.total_correct / pdfquizResults.score.total_questions) * 100;
    } else {
      if (!videoquizResults || !videoquizResults.score) return 0;
      return (videoquizResults.score.total_correct / videoquizResults.score.total_questions) * 100;
    }
  };

  const percentage = calculatePercentage();

  return (
    <div className="min-h-screen bg-white text-black">
      <header className="bg-black text-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold flex items-center">
            <svg className="w-8 h-8 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            Bitelearn
          </h1>
          <nav>
            {username ? (
              <button
                onClick={() => navigate('/userProfile')}
                className="bg-white text-black px-4 py-2 rounded-md hover:bg-gray-200 transition duration-300"
              >
                <svg className="w-6 h-6 inline-block mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                {username}
              </button>
            ) : (
              <button
                onClick={handleLogin}
                className="bg-white text-black px-4 py-2 rounded-md hover:bg-gray-200 transition duration-300"
              >
                <svg className="w-6 h-6 inline-block mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                </svg>
                Login
              </button>
            )}
          </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <h2 className="text-3xl font-semibold mb-6">Welcome to Bitelearn</h2>
          <p className="text-lg mb-8">Enhance your learning experience with our AI-powered question generation tools.</p>

          <div className="mb-8">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex">
                {['video', 'pdf', 'recommendations'].map((tab) => (
                  <button
                    key={tab}
                    className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                      activeTab === tab
                        ? 'border-black text-black'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                    onClick={() => setActiveTab(tab)}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </nav>
            </div>

            <div className="mt-8">
              {activeTab === 'video' && (
                <div>
                  <h3 className="text-2xl font-semibold mb-4">Generate Questions from Video</h3>
                  <form onSubmit={handleVideoSubmit} className="mb-8">
                    <label htmlFor="videoUrl" className="block text-sm font-medium text-gray-700 mb-2">
                      YouTube Video URL
                    </label>
                    <input
                      type="text"
                      id="videoUrl"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-black focus:border-black"
                      placeholder="https://www.youtube.com/watch?v=..."
                      value={videoUrl}
                      onChange={(e) => setVideoUrl(e.target.value)}
                    />
                    <button
                      type="submit"
                      className="mt-4 bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800 transition duration-300"
                      disabled={isLoading}
                    >
                      {isLoading ? 'Generating...' : 'Generate Questions'}
                    </button>
                  </form>

                  {isLoading && (
                    <div className="text-center py-8">
                      <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-black"></div>
                      <p className="mt-4 text-lg">Generating questions... This may take a few minutes.</p>
                    </div>
                  )}

                  {videoquestions.length > 0 && (
                    <div className="mt-8">
                      <h4 className="text-xl font-semibold mb-4">Quiz</h4>
                      <form onSubmit={handleQuizSubmit}>
                        {videoquestions.map((q, index) => (
                          <div key={index} className="mb-6">
                            <p className="font-medium mb-2">{index + 1}. {q.question}</p>
                            <div className="space-y-2">
                              {q.options.map((option, optionIndex) => (
                                <label key={optionIndex} className="flex items-center">
                                  <input
                                    type="radio"
                                    name={`question-${index}`}
                                    value={option}
                                    checked={userAnswers[q.question] === option}
                                    onChange={() => handleAnswerChange(index, option)}
                                    className="mr-2"
                                  />
                                  {option}
                                </label>
                              ))}
                            </div>
                          </div>
                        ))}
                        <button
                          type="submit"
                          className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800 transition duration-300"
                        >
                          Submit Quiz
                        </button>
                      </form>
                    </div>
                  )}

                  {videoquizResults && (
                    <div className="mt-8">
                      <h4 className="text-xl font-semibold mb-4">Results</h4>
                      <div className="bg-gray-100 rounded-lg p-4 mb-4">
                        <div className="flex justify-between items-center mb-2">
                          <span>Score:</span>
                          <span className="font-bold">{percentage.toFixed(2)}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div
                            className="bg-black h-2.5 rounded-full"
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                      </div>
                      {videoquizResults.results.map((result, index) => (
                        <div key={index} className="border-b border-gray-200 py-4 last:border-b-0">
                          <p className="font-medium mb-2">
                            {index + 1}. {result.question}
                          </p>
                          <p className={`mb-1 ${result.is_correct ? 'text-green-600' : 'text-red-600'}`}>
                            Your answer: {result.selected_option}
                          </p>
                          {!result.is_correct && (
                            <p className="text-green-600">
                              Correct answer: {result.correct_answer}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'pdf' && (
                <div>
                  <h3 className="text-2xl font-semibold mb-4">Generate Questions from PDF</h3>
                  <form onSubmit={handlePdfSubmit} className="mb-8">
                    <label htmlFor="pdfFile" className="block text-sm font-medium text-gray-700 mb-2">
                      Upload PDF
                    </label>
                    <input
                      type="file"
                      id="pdfFile"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-black focus:border-black"
                      onChange={(e) => setPdfFile(e.target.files ? e.target.files[0] : null)}
                    />
                    <button
                      type="submit"
                      className="mt-4 bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800 transition duration-300"
                      disabled={isLoading}
                    >
                      {isLoading ? 'Generating...' : 'Generate Questions'}
                    </button>
                  </form>

                  {isLoading && (
                    <div className="text-center py-8">
                      <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-black"></div>
                      <p className="mt-4 text-lg">Generating questions... This may take a few minutes.</p>
                    </div>
                  )}

                  {pdfquestions.length > 0 && (
                    <div className="mt-8">
                      <h4 className="text-xl font-semibold mb-4">Quiz</h4>
                      <form onSubmit={handleQuizSubmit}>
                        {pdfquestions.map((q, index) => (
                          <div key={index} className="mb-6">
                            <p className="font-medium mb-2">{index + 1}. {q.question}</p>
                            <div className="space-y-2">
                              {q.options.map((option, optionIndex) => (
                                <label key={optionIndex} className="flex items-center">
                                  <input
                                    type="radio"
                                    name={`question-${index}`}
                                    value={option}
                                    checked={userAnswers[q.question] === option}
                                    onChange={() => handleAnswerChange(index, option)}
                                    className="mr-2"
                                  />
                                  {option}
                                </label>
                              ))}
                            </div>
                          </div>
                        ))}
                        <button
                          type="submit"
                          className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800 transition duration-300"
                        >
                          Submit Quiz
                        </button>
                      </form>
                    </div>
                  )}

                  {pdfquizResults && (
                    <div className="mt-8">
                      <h4 className="text-xl font-semibold mb-4">Results</h4>
                      <div className="bg-gray-100 rounded-lg p-4 mb-4">
                        <div className="flex justify-between items-center mb-2">
                          <span>Score:</span>
                          <span className="font-bold">{percentage.toFixed(2)}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div
                            className="bg-black h-2.5 rounded-full"
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                      </div>
                      {pdfquizResults.results.map((result, index) => (
                        <div key={index} className="border-b border-gray-200 py-4 last:border-b-0">
                          <p className="font-medium mb-2">
                            {index + 1}. {result.question}
                          </p>
                          <p className={`mb-1 ${result.is_correct ? 'text-green-600' : 'text-red-600'}`}>
                            Your answer: {result.selected_option}
                          </p>
                          {!result.is_correct && (
                            <p className="text-green-600">
                              Correct answer: {result.correct_answer}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'recommendations' && (
                <div>
                  <h3 className="text-2xl font-semibold mb-4">Get Personalized Recommendations</h3>
                  <form onSubmit={handleRecommendationSubmit} className="mb-8">
                    <label htmlFor="topic" className="block text-sm font-medium text-gray-700 mb-2">
                      Topics (comma separated)
                    </label>
                    <input
                      type="text"
                      id="topic"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-black focus:border-black"
                      placeholder="e.g., AI, Machine Learning"
                      value={topic}
                      onChange={(e) => setTopic(e.target.value)}
                    />
                    <button
                      type="submit"
                      className="mt-4 bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800 transition duration-300"
                    >
                      Get Recommendations
                    </button>
                  </form>

                  {recommendations.length > 0 && (
                    <div className="mt-8">
                      <h4 className="text-xl font-semibold mb-4">Recommended Videos</h4>
                      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {recommendations.map((rec, index) => (
                          <div key={index} className="border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
                            <div className="p-4">
                              <h5 className="font-semibold text-lg mb-2">{rec.title}</h5>
                              <p className="text-sm text-gray-600 mb-4">{rec.description}</p>
                              <div className="flex justify-between items-center text-sm text-gray-500">
                                <span>{rec.views.toLocaleString()} views</span>
                                <span>{rec.likes.toLocaleString()} likes</span>
                              </div>
                              <a
                                href={rec.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="mt-4 inline-block bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800 transition duration-300"
                              >
                                Watch Video
                              </a>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}



























// import { useState } from 'react';
// import { useNavigate } from "react-router-dom";
// import { Button } from '../components/ui/Button';
// import { Input } from '../components/ui/Input';
// import { Label } from '../components/ui/Label';
// import { Tabs, TabsList, TabsTrigger, TabsContent } from '../components/ui/Tabs';
// import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../components/Card';
// import { BookOpen } from 'lucide-react';
// import Cookies from 'js-cookie';
// import { RadioGroup, RadioGroupItem } from '../components/ui/RadioGroup';
// import { ExternalLink, ThumbsUp, Eye } from 'lucide-react';
// import { Badge } from '../components/ui/Badge';
// import Progress from '../components/ui/Progress';

// const Home = () => {
//   const [videoUrl, setVideoUrl] = useState('');
//   const [pdfFile, setPdfFile] = useState(null);
//   const [topic, setTopic] = useState('');
//   const [recommendations, setRecommendations] = useState([]);
//   const [FUllquestions, setFUllquestions] = useState({video_q:[],pdf_q:[]});
//   const [questions, setQuestions] = useState([]);
//   //  set active tab
//   const [active_tab,setActive_tab] = useState('video');

//   const [fulluserAns,setFullUserAns] = useState({video_ans:{},pdf_ans:{}});
//   const [userAnswers, setUserAnswers] = useState({});

//   const [videoId, setVideoId] = useState(''); // State to store video_id
//   const [error, setError] = useState(""); // To hold error messages
//   const [fullQuizResults, setFullQuizResults] = useState({video_res:null,pdf_res:null});
//   const [quizResults, setQuizResults] = useState(null);
//   const navigate = useNavigate();

//   const handleVideoSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const token = Cookies.get('auth_token');
//       if (!token) {
//         setError("You are not allowed to access this page. Redirecting to signup...");
//         setTimeout(() => {
//           navigate("/signup"); // Redirect after 2 seconds
//         }, 2000);
//         return;
//       }
//       const response = await fetch('http://localhost:8000/api/upload/video/', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${token}`
//         },
//         body: JSON.stringify({ video_url: videoUrl })
//       });
  
//       if (!response.ok) {
//         throw new Error('Network response was not ok.');
//       }
  
//       const data = await response.json();

//       setFUllquestions({video_q:data.questions,pdf_q:fullQuizResults.pdf_q});
//       setQuestions(data.questions);
      
//       setVideoId(data.video_id); // Set the video ID from the response
//     } catch (error) {
//       console.error('Error fetching video questions:', error);
//     }
//   };

//   const handlePdfSubmit = async (e) => {
//     e.preventDefault();
//     if (!pdfFile) {
//       alert('Please select a PDF file to upload.');
//       return;
//     }
    
//     try {
//       const token = Cookies.get('auth_token');
//       if (!token) {
//         setError("You are not allowed to access this page. Redirecting to signup...");
//         setTimeout(() => {
//           navigate("/signup"); // Redirect after 2 seconds
//         }, 2000);
//         return;
//       }
  
//       // Create FormData object
//       const formData = new FormData();
//       formData.append('pdf_file', pdfFile);
  
//       const response = await fetch('http://localhost:8000/api/upload/pdf/', {
//         method: 'POST',
//         headers: {
//           'Authorization': `Bearer ${token}`
//         },
//         body: formData
//       });
  
//       if (!response.ok) {
//         throw new Error('Network response was not ok.');
//       }
  
//       const data = await response.json();
//       setQuestions(data.questions);
//       setFUllquestions({video_q:fullQuizResults.video_q,pdf_q:data.questions});

//       setVideoId(data.file_id); // Set the pdf ID from the response
//     } catch (error) {
//       console.error('Error uploading PDF:', error);
//       setError('An error occurred while uploading the PDF.');
//     }
//   };

//   const handleRecommendationSubmit = async (e) => {
//     e.preventDefault();

//     if (!topic.trim()) {
//       alert('Please enter at least one topic.');
//       return;
//     }

//     try {
//       const topicsArray = topic.split(',').map(t => t.trim()).filter(t => t.length > 0);
//       const token = Cookies.get('auth_token');
//       if (!token) {
//         setError("You are not allowed to access this page. Redirecting to signup...");
//         setTimeout(() => {
//           navigate("/signup"); // Redirect after 2 seconds
//         }, 2000);
//         return;
//       }
//       const response = await fetch('http://localhost:8000/api/recommendations/', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${token}`
//         },
//         body: JSON.stringify({ topics: topicsArray })
//       });

//       if (!response.ok) {
//         throw new Error('Network response was not ok.');
//       }

//       const data = await response.json();
//       setRecommendations(data);
//     } catch (error) {
//       console.error('Error fetching recommendations:', error);
//     }
//   };

//   const handleAnswerChange = (questionIndex, selectedOption) => {
//     setUserAnswers(prevAnswers => ({
//       ...prevAnswers,
//       [questions[questionIndex].question]: selectedOption
//     }));
//     if (active_tab=="pdf") {
//         setFullUserAns({...fulluserAns,pdf_ans:{...userAnswers}})
//     }else {setFullUserAns({...fulluserAns,video_ans:{...userAnswers}})}
//   };

//   const handleQuizSubmit = async (e) => {
//     e.preventDefault();
  
//     if (!videoId && !pdfFile) {
//       alert('Please submit a video or PDF first.');
//       return;
//     }
  
//     try {
//       const formattedAnswers = questions.map((q) => ({
//         question: q.question,
//         selected_option: userAnswers[q.question] || '',
//       }));
  
//       const requestBody = {
//         answers: formattedAnswers,
//       };
//       let flag = true;
//       if (pdfFile) {
//         requestBody.pdf = videoId;
//         console.log(requestBody.pdf) 
//         console.log("in pdf")
//         flag = false
//       }
//       if (videoId && flag) {
//         requestBody.video = videoId;
        
//         console.log(requestBody.video)
//         console.log("in video")
//       }
  

  
//       const response = await fetch('http://localhost:8000/api/submit_answer/', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${Cookies.get('auth_token')}`,
//         },
//         body: JSON.stringify(requestBody),
//       });
  
//       if (!response.ok) {
//         throw new Error('Network response was not ok.');
//       }
  
//       const resultData = await response.json();
//       // setQuizResults(resultData); // Save the results returned from the backend
//       if (active_tab=="video") {
//         setFullQuizResults({video_res:resultData,pdf_res:fullQuizResults.pdf_res}),
//         setQuizResults(resultData)
//     }
//       else {setFullQuizResults({video_res:fullQuizResults.video_res,pdf_res:resultData}),
//           setQuizResults(resultData)
//     }
        
//       alert('Quiz submitted successfully!');
//     } catch (error) {
//       console.error('Error submitting quiz:', error);
//       setError('An error occurred while submitting the quiz.');
//     }
//   };
  

//   const calculatePercentage = () => {
//     if (!quizResults || !quizResults.score) return 0;
//     return (quizResults.score.total_correct / quizResults.score.total_questions) * 100;
//   };

//   const percentage = calculatePercentage();

//   return (
//     <div className="min-h-screen bg-gradient-to-b from-blue-100 to-white">
//       <header className="bg-white shadow">
//         <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
//           <h1 className="text-3xl font-bold text-gray-900 flex items-center">
//             <BookOpen className="mr-2 h-8 w-8 text-blue-500" />
//             Bitelearn
//           </h1>
//           <nav>
//             <Button variant="ghost">About</Button>
//             <Button variant="ghost">Contact</Button>
//             <Button variant="outline">Login</Button>
//           </nav>
//         </div>
//       </header>

//       <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
//         <div className="px-4 py-6 sm:px-0">
//           <h2 className="text-2xl font-semibold text-gray-900 mb-6">Welcome to Bitelearn</h2>
//           <p className="text-lg text-gray-700 mb-8">Enhance your learning experience with our AI-powered question generation tools.</p>

//           <Tabs defaultValue="video">
//             {(activeTab, setActiveTab) => (
//               <>
//                 <TabsList>
//                 <button value="video" onClick={() => {setActive_tab("video");setQuestions(FUllquestions.video_q);setQuizResults(fullQuizResults.video_res);setUserAnswers(fulluserAns.video_ans);console.log('hello video',questions)}}>Video Questions</button>

//                 <button value="pdf"  onClick={() => {setActiveTab("pdf");setQuestions(FUllquestions.pdf_q);setQuizResults(fullQuizResults.pdf_res);setUserAnswers(fulluserAns.pdf_ans);console.log('hello pdf',questions)}}>PDF Questions</button>
//                   <TabsTrigger value="recommendations" setActiveTab={setActiveTab}>Get Recommendations</TabsTrigger>
//                 </TabsList>
//                 <TabsContent value="video" activeTab={activeTab}>
//                   <Card>
//                     <CardHeader>
//                       <CardTitle>Generate Questions from Video</CardTitle>
//                       <CardDescription>Enter a YouTube video URL to get questions and answers.</CardDescription>
//                     </CardHeader>
//                     <CardContent>
//                       <form onSubmit={handleVideoSubmit}>
//                         <Label htmlFor="videoUrl">YouTube Video URL</Label>
//                         <Input
//                           id="videoUrl"
//                           placeholder="https://www.youtube.com/watch?v=..."
//                           value={videoUrl}
//                           onChange={(e) => setVideoUrl(e.target.value)}
//                         />
//                         <Button type="submit" className="mt-4">Generate Questions</Button>
//                       </form>
//                     </CardContent>
//                     <CardFooter className="flex justify-between">
//                       <Button variant="outline" onClick={() => setVideoUrl('')}>Clear</Button>
//                     </CardFooter>
//                   </Card>

//                   {questions.length > 0 && (
//                     <Card className="mt-8">
//                       <CardHeader>
//                         <CardTitle>Quiz</CardTitle>
//                         <CardDescription>Answer the questions below.</CardDescription>
//                       </CardHeader>
//                       <CardContent>
//                         <form onSubmit={handleQuizSubmit}>
//                           {questions.map((q, index) => (
//                             <div key={index} className="mb-8 last:mb-0">
//                               <p className="font-semibold mb-3 text-lg">
//                                 {index + 1}. {q.question}
//                               </p>
//                               <RadioGroup
//                                 value={userAnswers[q.question] || ""}
//                                 onValueChange={(value) => handleAnswerChange(index, value)}
//                                 className="space-y-2"
//                               >
//                                 {q.options.map((option, optionIndex) => (
//                                   <RadioGroupItem
//                                     key={optionIndex}
//                                     value={option}
//                                     id={`question-${index}-option-${optionIndex}`}
//                                   >
//                                     {option}
//                                   </RadioGroupItem>
//                                 ))}
//                               </RadioGroup>
//                             </div>
//                           ))}
//                           <Button type="submit">Submit Quiz</Button>
//                         </form>
//                         {quizResults && (
//                           <div className="mt-8">
//                             <h3 className="text-xl font-semibold">Results</h3>
//                             <Progress value={percentage} className="mt-4">
//                               {percentage.toFixed(2)}%
//                             </Progress>
//                             {quizResults.results.map((result, index) => (
//                               <Card key={index} className="mt-4">
//                                 <CardContent>
//                                   <p className="font-semibold">
//                                     Question {index + 1}: {result.question}
//                                   </p>
//                                   <p className={`mt-1 text-sm ${result.is_correct ? 'text-green-500' : 'text-red-500'}`}>
//                                     Your answer: {result.selected_option}
//                                   </p>
//                                   {!result.is_correct && (
//                                     <p className="mt-1 text-sm text-red-500">Correct answer: {result.correct_answer}</p>
//                                   )}
//                                 </CardContent>
//                               </Card>
//                             ))}
//                           </div>
//                         )}
//                       </CardContent>
//                     </Card>
//                   )}
//                 </TabsContent>
//                 <TabsContent value="pdf" activeTab={activeTab}>
//                 <Card>
//   <CardHeader>
//     <CardTitle>Generate Questions from PDF</CardTitle>
//     <CardDescription>Upload a PDF file to get questions and answers.</CardDescription>
//   </CardHeader>
//   <CardContent>
//     <form onSubmit={handlePdfSubmit}>
//       <Label htmlFor="pdfFile">Upload PDF</Label>
//       <Input
//         type="file"
//         id="pdfFile"
//         onChange={(e) => setPdfFile(e.target.files[0])}
//       />
//       <Button type="submit" className="mt-4">Generate Questions</Button>
//     </form>
//   </CardContent>
//   <CardFooter className="flex justify-between">
//     <Button variant="outline" onClick={() => setPdfFile(null)}>Clear</Button>
//   </CardFooter>
// </Card>
// {questions.length > 0 && (
//   <Card className="mt-8">
//     <CardHeader>
//       <CardTitle>Quiz</CardTitle>
//       <CardDescription>Answer the questions below.</CardDescription>
//     </CardHeader>
//     <CardContent>
//       <form onSubmit={handleQuizSubmit}>
//         {questions.map((q, index) => (
//           <div key={index} className="mb-8 last:mb-0">
//             <p className="font-semibold mb-3 text-lg">
//               {index + 1}. {q.question}
//             </p>
//             <RadioGroup
//               value={userAnswers[q.question] || ""}
//               onValueChange={(value) => handleAnswerChange(index, value)}
//               className="space-y-2"
//             >
//               {q.options.map((option, optionIndex) => (
//                 <RadioGroupItem
//                   key={optionIndex}
//                   value={option}
//                   id={`question-${index}-option-${optionIndex}`}
//                 >
//                   {option}
//                 </RadioGroupItem>
//               ))}
//             </RadioGroup>
//           </div>
//         ))}
//         <Button type="submit" className="mt-4">Submit Quiz</Button>
//       </form>
//       {quizResults && (
//         <div className="mt-8">
//           <h3 className="text-xl font-semibold">Results</h3>
//           <Progress value={percentage} className="mt-4">
//             {percentage}%
//           </Progress>
//           {quizResults.results.map((result, index) => (
//             <Card key={index} className="mt-4">
//               <CardContent>
//                 <p className="font-semibold">
//                   Question {index + 1}: {result.question}
//                 </p>
//                 <p className={`mt-1 text-sm ${result.is_correct ? 'text-green-500' : 'text-red-500'}`}>
//                   Your answer: {result.selected_option}
//                 </p>
//                 {!result.is_correct && (
//                   <p className="mt-1 text-sm text-red-500">Correct answer: {result.correct_answer}</p>
//                 )}
//               </CardContent>
//             </Card>
//           ))}
//         </div>
//       )}
//     </CardContent>
//   </Card>
// )}
//                 </TabsContent>
//                 <TabsContent value="recommendations" activeTab={activeTab}>
//                   <Card>
//                     <CardHeader>
//                       <CardTitle>Get Personalized Recommendations</CardTitle>
//                       <CardDescription>Enter topics of interest to get tailored recommendations.</CardDescription>
//                     </CardHeader>
//                     <CardContent>
//                       <form onSubmit={handleRecommendationSubmit}>
//                         <Label htmlFor="topic">Topics (comma separated)</Label>
//                         <Input
//                           id="topic"
//                           placeholder="e.g., AI, Machine Learning"
//                           value={topic}
//                           onChange={(e) => setTopic(e.target.value)}
//                         />
//                         <Button type="submit" className="mt-4">Get Recommendations</Button>
//                       </form>
//                     </CardContent>
//                     <CardFooter className="flex justify-between">
//                       <Button variant="outline" onClick={() => setTopic('')}>Clear</Button>
//                     </CardFooter>
//                   </Card>

//                   <div className="max-w-4xl mx-auto p-4">
//                     {recommendations.length > 0 && (
//                       <Card className="mt-8 bg-gradient-to-b from-blue-100 to-white">
//                         <CardHeader>
//                           <CardTitle className="text-2xl font-bold">Recommended Videos</CardTitle>
//                         </CardHeader>
//                         <CardContent>
//                           <ul className="space-y-6">
//                             {recommendations.map((rec, index) => (
//                               <li 
//                                 key={index} 
//                                 className="bg-white shadow-md rounded-lg overflow-hidden transition-all duration-300 hover:shadow-xl"
//                               >
//                                 <div className="p-6">
//                                   <h3 className="font-semibold text-xl mb-2 text-blue-600">{rec.title}</h3>
//                                   <p className="text-gray-600 mb-4">{rec.description}</p>
//                                   <div className="flex items-center justify-between">
//                                     <div className="flex items-center space-x-4">
//                                       <Badge variant="secondary" className="flex items-center space-x-1">
//                                         <Eye className="w-4 h-4" />
//                                         <span>{rec.views.toLocaleString()}</span>
//                                       </Badge>
//                                       <Badge variant="secondary" className="flex items-center space-x-1">
//                                         <ThumbsUp className="w-4 h-4" />
//                                         <span>{rec.likes.toLocaleString()}</span>
//                                       </Badge>
//                                     </div>
//                                     <Button asChild>
//                                       <a 
//                                         href={rec.url} 
//                                         target="_blank" 
//                                         rel="noopener noreferrer"
//                                         className="flex items-center space-x-2"
//                                       >
//                                         <span>Watch Video</span>
//                                         <ExternalLink className="w-4 h-4" />
//                                       </a>
//                                     </Button>
//                                   </div>
//                                 </div>
//                               </li>
//                             ))}
//                           </ul>
//                         </CardContent>
//                       </Card>
//                     )}
//                   </div>
//                 </TabsContent>
//               </>
//             )}
//           </Tabs>
//         </div>
//       </main>
//     </div>
//   );
// };

// export default Home;
