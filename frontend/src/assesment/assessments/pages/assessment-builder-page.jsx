import React from "react";
import { useParams } from "react-router-dom";
import SimpleAssessmentBuilder from "../components/simple-assessment-builder";

export const AssessmentBuilderPage = () => {
  const { jobId, assessmentId } = useParams();

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <SimpleAssessmentBuilder />
    </div>
  );
};
