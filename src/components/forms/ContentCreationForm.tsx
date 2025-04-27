import React, { useState, useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { ContentType, ContentRequest } from '../../types';
import { api } from '../../lib/api';
import { LimitReachedModal } from '../ui/LimitReachedModal';

interface ContentCreationFormProps {
  onContentGenerated: (content: any) => void;
  onError: (error: string) => void;
}

// Validation schema
const ContentCreationSchema = Yup.object().shape({
  content_type: Yup.number().required('Content type is required'),
  topic: Yup.string().required('Topic is required').min(3, 'Topic must be at least 3 characters'),
  tone: Yup.string().required('Tone is required'),
  target_audience: Yup.string().required('Target audience is required'),
  length: Yup.number()
    .required('Length is required')
    .min(50, 'Minimum length is 50 words')
    .max(5000, 'Maximum length is 5000 words'),
  title: Yup.string(),
  additional_instructions: Yup.string(),
});

// Available tone options
const toneOptions = [
  'Professional', 'Casual', 'Humorous', 'Formal', 'Inspirational',
  'Educational', 'Persuasive', 'Conversational', 'Authoritative', 'Emotional'
];

export const ContentCreationForm: React.FC<ContentCreationFormProps> = ({
  onContentGenerated,
  onError
}) => {
  const [contentTypes, setContentTypes] = useState<ContentType[]>([]);
  const [loading, setLoading] = useState(false);
  const [showLimitModal, setShowLimitModal] = useState(false);
  const [usageCount, setUsageCount] = useState<number | null>(null);

  // Fetch content types and user profile on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const types = await api.getContentTypes();
        setContentTypes(types);

        // Get user profile to show usage count
        const profile = await api.getUserProfile();
        setUsageCount(profile.api_requests_count);
      } catch (error) {
        onError('Failed to load content types. Please try again later.');
      }
    };

    fetchData();
  }, [onError]);

  // Initial form values
  const initialValues: ContentRequest = {
    content_type: 0,
    topic: '',
    tone: '',
    target_audience: '',
    length: 500,
    title: '',
    additional_instructions: '',
  };

  // Handle form submission
  const handleSubmit = async (values: ContentRequest) => {
    setLoading(true);
    try {
      const content = await api.generateContent(values);
      onContentGenerated(content);

      // Update usage count after successful generation
      try {
        const profile = await api.getUserProfile();
        setUsageCount(profile.api_requests_count);
      } catch (e) {
        // Silently fail if can't update usage count
      }
    } catch (error: any) {
      // Check if it's a limit reached error
      if (error.response?.status === 403 && error.response?.data?.limit_reached) {
        setShowLimitModal(true);
      } else {
        onError(error.response?.data?.error || 'Failed to generate content. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const isPremiumUser = usageCount !== null && usageCount >= 10;

  return (
    <div className="card">
      <h2 className="text-2xl font-bold text-text-primary mb-6">Create Content</h2>

      {/* Usage limit indicator */}
      {usageCount !== null && !isPremiumUser && (
        <div className="mb-6 p-3 bg-secondary rounded-md">
          <div className="flex justify-between items-center">
            <span className="text-text-secondary">Monthly Usage: {usageCount}/10</span>
            <span className="text-xs px-2 py-1 bg-accent/20 text-accent rounded-full">
              Free Plan
            </span>
          </div>
          <div className="mt-2 w-full bg-border rounded-full h-2.5">
            <div
              className="bg-accent h-2.5 rounded-full"
              style={{ width: `${(usageCount / 10) * 100}%` }}
            ></div>
          </div>
        </div>
      )}

      <Formik
        initialValues={initialValues}
        validationSchema={ContentCreationSchema}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({ isSubmitting }) => (
          <Form className="space-y-6">
            {/* Content Type */}
            <div>
              <label htmlFor="content_type" className="block text-sm font-medium text-text-secondary mb-1">
                Content Type
              </label>
              <Field
                as="select"
                id="content_type"
                name="content_type"
                className="input"
                disabled={contentTypes.length === 0}
              >
                <option value="">Select content type</option>
                {contentTypes.map((type) => (
                  <option key={type.id} value={type.id}>
                    {type.name}
                  </option>
                ))}
              </Field>
              <ErrorMessage name="content_type" component="p" className="mt-1 text-sm text-error" />
            </div>

            {/* Topic */}
            <div>
              <label htmlFor="topic" className="block text-sm font-medium text-text-secondary mb-1">
                Topic
              </label>
              <Field
                type="text"
                id="topic"
                name="topic"
                placeholder="E.g., Sustainable gardening practices"
                className="input"
              />
              <ErrorMessage name="topic" component="p" className="mt-1 text-sm text-error" />
            </div>

            {/* Tone */}
            <div>
              <label htmlFor="tone" className="block text-sm font-medium text-text-secondary mb-1">
                Tone
              </label>
              <Field
                as="select"
                id="tone"
                name="tone"
                className="input"
              >
                <option value="">Select tone</option>
                {toneOptions.map((tone) => (
                  <option key={tone} value={tone.toLowerCase()}>
                    {tone}
                  </option>
                ))}
              </Field>
              <ErrorMessage name="tone" component="p" className="mt-1 text-sm text-error" />
            </div>

            {/* Target Audience */}
            <div>
              <label htmlFor="target_audience" className="block text-sm font-medium text-text-secondary mb-1">
                Target Audience
              </label>
              <Field
                type="text"
                id="target_audience"
                name="target_audience"
                placeholder="E.g., Homeowners interested in eco-friendly solutions"
                className="input"
              />
              <ErrorMessage name="target_audience" component="p" className="mt-1 text-sm text-error" />
            </div>

            {/* Length */}
            <div>
              <label htmlFor="length" className="block text-sm font-medium text-text-secondary mb-1">
                Length (words)
              </label>
              <Field
                type="number"
                id="length"
                name="length"
                min="50"
                max="5000"
                className="input"
              />
              <ErrorMessage name="length" component="p" className="mt-1 text-sm text-error" />
            </div>

            {/* Title (Optional) */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-text-secondary mb-1">
                Title (Optional)
              </label>
              <Field
                type="text"
                id="title"
                name="title"
                placeholder="Leave blank for auto-generated title"
                className="input"
              />
              <ErrorMessage name="title" component="p" className="mt-1 text-sm text-error" />
            </div>

            {/* Additional Instructions (Optional) */}
            <div>
              <label htmlFor="additional_instructions" className="block text-sm font-medium text-text-secondary mb-1">
                Additional Instructions (Optional)
              </label>
              <Field
                as="textarea"
                id="additional_instructions"
                name="additional_instructions"
                rows={3}
                placeholder="Any specific requirements or details you want to include"
                className="input"
              />
              <ErrorMessage name="additional_instructions" component="p" className="mt-1 text-sm text-error" />
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={isSubmitting || loading}
                className="btn-primary w-full flex items-center justify-center"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Generating...
                  </>
                ) : (
                  'Generate Content'
                )}
              </button>
            </div>
          </Form>
        )}
      </Formik>

      {/* Limit Reached Modal */}
      <LimitReachedModal
        isOpen={showLimitModal}
        onClose={() => setShowLimitModal(false)}
      />
    </div>
  );
};