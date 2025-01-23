import React from 'react';

export default function About() {
  return (
    <div className='px-6 py-12 max-w-6xl mx-auto'>
      {/* Header */}
      <h1 className='text-4xl font-bold mb-6 text-slate-800'>
        About <span className='text-blue-600'>PrepAhead</span>
      </h1>

      {/* Introduction */}
      <div className='mb-6 text-lg text-slate-700 leading-relaxed'>
        <p className='mb-6'>
          <strong className='text-slate-900'>PrepAhead</strong> is your personalized guide to professional success. Whether you’re aiming for your first job or looking to advance your career, PrepAhead is designed to help you achieve your dream role.
        </p>

        <p className='mb-6'>
          Combining <strong>expert mentorship</strong>, tailored <strong>career roadmaps</strong>, and advanced skill assessments, PrepAhead offers all the tools you need to excel.
        </p>

        <p className='mb-6'>
          Our AI-driven platform identifies skill gaps, recommends the best resources, and connects you with professionals for one-on-one guidance. PrepAhead is here to empower you at every stage of your journey.
        </p>
      </div>

      {/* Why Choose PrepAhead */}
      <div className='my-8 bg-gray-50 p-6 rounded-lg shadow-md'>
        <h2 className='text-3xl font-semibold mb-6 text-blue-600'>
          Why Choose <span className='text-slate-800'>PrepAhead?</span>
        </h2>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
          <div className='flex items-start space-x-4'>
            <div className='bg-blue-100 p-3 rounded-full'>
              {/* Placeholder for roadmap */}
            </div>
            <div>
              <h3 className='font-semibold text-slate-900'>
                Personalized Career Roadmaps
              </h3>
              <p className='text-slate-700'>
                A step-by-step guide tailored to your career goals.
              </p>
            </div>
          </div>
          <div className='flex items-start space-x-4'>
            <div className='bg-blue-100 p-3 rounded-full'>
              {/* Placeholder for mentorship */}
            </div>
            <div>
              <h3 className='font-semibold text-slate-900'>
                Expert Mentorship
              </h3>
              <p className='text-slate-700'>
                Connect with industry mentors to guide your career path.
              </p>
            </div>
          </div>

          <div className='flex items-start space-x-4'>
            <div className='bg-blue-100 p-3 rounded-full'>
              {/* Placeholder for AI insights */}
            </div>
            <div>
              <h3 className='font-semibold text-slate-900'>
                AI-Powered Insights
              </h3>
              <p className='text-slate-700'>
                Data-driven insights to boost your career prospects.
              </p>
            </div>
          </div>

          <div className='flex items-start space-x-4'>
            <div className='bg-blue-100 p-3 rounded-full'>
              {/* Placeholder for skill assessments */}
            </div>
            <div>
              <h3 className='font-semibold text-slate-900'>
                Skill Assessments
              </h3>
              <p className='text-slate-700'>
                Comprehensive assessments to identify your strengths and areas for improvement.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Final Section */}
      <div className='mt-8 text-lg text-slate-700 leading-relaxed'>
        <p className='mb-4'>
          At <strong>PrepAhead</strong>, we’re dedicated to helping you navigate your career with ease. With our tools, resources, and expert guidance, your success is within reach.
        </p>
        <p className='mb-4'>
          Join us today and take control of your future!
        </p>
      </div>
    </div>
  );
}