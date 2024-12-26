import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import Chart from 'chart.js/auto';

const EnhancedUserProfile = () => {
  const [userData, setUserData] = useState({
    username: '',
    email: '',
    contact_number: '',
    is_verified: false,
    video_request_count: 0,
    video_urls: [],
    pdf_request_count: 0,
    score_data: {
      total_correct_answer: '0',
      total_wrong_answer: '0',
      total_unattempted_question: '0',
      total_question: '0'
    }
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('performance');
  const navigate = useNavigate();

  const pieChartRef = useRef(null);
  const barChartRef = useRef(null);
  const lineChartRef = useRef(null);
  const chartInstancesRef = useRef({});

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = Cookies.get('auth_token');
        if (!token) {
          setError("You are not allowed to access this page. Redirecting to signup...");
          setTimeout(() => {
            navigate('/signup');
          }, 2000);
          return;
        }

        const response = await fetch('http://localhost:8000/api/progress/', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();
        setUserData({
          ...data,
          video_urls: data.video_urls || [],
          pdf_request_count: data.pdf_request_count || 0
        });
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  useEffect(() => {
    if (!loading && !error) {
      renderCharts();
    }
    return () => {
      // Cleanup function to destroy charts when component unmounts
      Object.values(chartInstancesRef.current).forEach(chart => chart.destroy());
    };
  }, [loading, error, userData, activeTab]);

  const renderCharts = () => {
    const scoreData = [
      parseInt(userData.score_data.total_correct_answer),
      parseInt(userData.score_data.total_wrong_answer),
      parseInt(userData.score_data.total_unattempted_question)
    ];

    // Helper function to create or update a chart
    const createOrUpdateChart = (canvasRef, chartType, data, options) => {
      const ctx = canvasRef.current.getContext('2d');
      
      // Destroy existing chart if it exists
      if (chartInstancesRef.current[chartType]) {
        chartInstancesRef.current[chartType].destroy();
      }

      // Create new chart
      chartInstancesRef.current[chartType] = new Chart(ctx, {
        type: chartType,
        data: data,
        options: options
      });
    };

    // Pie Chart
    if (pieChartRef.current && activeTab === 'performance') {
      createOrUpdateChart(pieChartRef, 'pie', {
        labels: ['Correct', 'Wrong', 'Unattempted'],
        datasets: [{
          data: scoreData,
          backgroundColor: ['#10B981', '#EF4444', '#F59E0B'],
          borderColor: ['#059669', '#DC2626', '#D97706'],
          borderWidth: 1
        }]
      }, {
        responsive: true,
        plugins: {
          legend: {
            position: 'bottom',
          },
          title: {
            display: true,
            text: 'Score Distribution'
          }
        },
        animation: {
          animateScale: true,
          animateRotate: true
        }
      });
    }

    // Bar Chart
    if (barChartRef.current && activeTab === 'performance') {
      createOrUpdateChart(barChartRef, 'bar', {
        labels: ['Correct', 'Wrong', 'Unattempted'],
        datasets: [{
          label: 'Score',
          data: scoreData,
          backgroundColor: ['#10B981', '#EF4444', '#F59E0B'],
          borderColor: ['#059669', '#DC2626', '#D97706'],
          borderWidth: 1
        }]
      }, {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true
          }
        },
        plugins: {
          legend: {
            display: false
          },
          title: {
            display: true,
            text: 'Score Comparison'
          }
        },
        animation: {
          duration: 1500,
          easing: 'easeInOutQuart'
        }
      });
    }

    // Line Chart for Progress
    if (lineChartRef.current && activeTab === 'progress') {
      createOrUpdateChart(lineChartRef, 'line', {
        labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
        datasets: [
          {
            label: 'Video Requests',
            data: [2, 5, 8, userData.video_request_count],
            borderColor: '#3B82F6',
            tension: 0.1
          },
          {
            label: 'PDF Requests',
            data: [1, 3, 6, userData.pdf_request_count],
            borderColor: '#10B981',
            tension: 0.1
          }
        ]
      }, {
        responsive: true,
        plugins: {
          legend: {
            position: 'bottom',
          },
          title: {
            display: true,
            text: 'Learning Progress Over Time'
          }
        },
        scales: {
          y: {
            beginAtZero: true
          }
        },
        animation: {
          duration: 2000,
          easing: 'easeInOutQuart'
        }
      });
    }
  };

  if (loading) return <div className="flex justify-center items-center h-screen">Loading...</div>;
  if (error) return <div className="flex justify-center items-center h-screen text-red-500">{error}</div>;

  return (
    <div className="min-h-screen bg-white text-black">
      <header className="bg-black text-white p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">User Profile</h1>
        <button
          onClick={() => navigate('/')}
          className="bg-white text-black px-4 py-2 rounded-md hover:bg-gray-200 transition duration-300"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline-block mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
          </svg>
          Home
        </button>
      </header>

      <main className="container mx-auto p-6">
        <div className="bg-white shadow-lg rounded-lg overflow-hidden mb-8">
          <div className="p-6 md:flex">
            <div className="md:w-1/3 mb-4 md:mb-0">
              <div className="w-32 h-32 bg-gray-300 rounded-full mx-auto flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 text-gray-600" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
            <div className="md:w-2/3 md:pl-6">
              <h2 className="text-3xl font-bold mb-2">{userData.username}</h2>
              <p className="text-gray-600 mb-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline-block mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
                {userData.email}
              </p>
              <p className="text-gray-600 mb-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline-block mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                </svg>
                {userData.contact_number}
              </p>
              {userData.is_verified && (
                <span className="bg-green-500 text-white px-2 py-1 rounded-full text-sm">Verified</span>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-2 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
              </svg>
              Total Questions
            </h3>
            <p className="text-3xl font-bold">{userData.score_data.total_question}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-2 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Correct Answers
            </h3>
            <p className="text-3xl font-bold">{userData.score_data.total_correct_answer}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-2 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Accuracy
            </h3>
            <p className="text-3xl font-bold">
              {((parseInt(userData.score_data.total_correct_answer) / parseInt(userData.score_data.total_question)) * 100).toFixed(1)}%
            </p>
          </div>
        </div>

        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="border-b border-gray-200">
            <nav className="flex">
              {['Performance', 'Progress', 'Resources'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab.toLowerCase())}
                  className={`px-4 py-2 font-medium ${
                    activeTab === tab.toLowerCase()
                      ? 'border-b-2 border-black text-black'
                      : 'text-gray-500 hover:text-black'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'performance' && (
              <div>
                <h3 className="text-xl font-semibold mb-4">Performance Overview</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <canvas ref={pieChartRef} />
                  </div>
                  <div>
                    <canvas ref={barChartRef} />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'progress' && (
              <div>
                <h3 className="text-xl font-semibold mb-4">Learning Progress</h3>
                <div className="mb-8">
                  <canvas ref={lineChartRef} />
                </div>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span>Video Requests</span>
                      <span>{userData.video_request_count}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div className="bg-black h-2.5 rounded-full" style={{ width: `${(userData.video_request_count / 10) * 100}%` }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span>PDF Requests</span>
                      <span>{userData.pdf_request_count}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div className="bg-black h-2.5 rounded-full" style={{ width: `${(userData.pdf_request_count / 10) * 100}%` }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'resources' && (
              <div>
                <h3 className="text-xl font-semibold mb-4">Learning Resources</h3>
                <div className="space-y-4">
                  {userData.video_urls.map((url, index) => (
                    <div key={index} className="flex items-center p-3 bg-gray-100 rounded-lg">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <a href={url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{url}</a>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default EnhancedUserProfile;