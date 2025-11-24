import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "../ui/button";
import Shrimmer from "@/components/ui/Shrimmer";
import LazyLoad from "@/components/ui/LazyLoad";

interface Course {
 id: number;
 name: string;
 image_url: string;
}

interface CourseSelectionProps {
 selectedCourses: { id: number; name: string }[];
 setSelectedCourses: React.Dispatch<
  React.SetStateAction<{ id: number; name: string }[]>
 >;
 handleGoBack: () => void;
 handleContinue: () => void;
 toggleCourse: (course: { id: number; name: string }) => void;
}

const CourseSelection: React.FC<CourseSelectionProps> = ({
 selectedCourses,
 setSelectedCourses,
 handleGoBack,
 handleContinue,
 toggleCourse,
}) => {
 const [courseTypes, setCourseTypes] = useState<Course[]>([]);
 const [loading, setLoading] = useState<boolean>(true);
 const [error, setError] = useState<string | null>(null);

 const baseUrl = import.meta.env.VITE_API_URL;
 const authToken = sessionStorage.getItem("authToken");

 useEffect(() => {
  const fetchCourses = async () => {
   try {
    const response = await axios.get(`${baseUrl}/api/catering/courses/`, {
     headers: {
      Authorization: `Token ${authToken}`,
     },
    });

    // Assuming the response is in the format [{ name, image }]
    setCourseTypes(response.data);
    setLoading(false);
   } catch (err) {
    console.error("Error fetching courses:", err);
    setError("Failed to load courses. Please try again later.");
    setLoading(false);
   }
  };
  const timer = setTimeout(() => {
   fetchCourses();
  }, 1000); // ⏱️ 2-second delay

  return () => clearTimeout(timer); // cleanup
 }, [baseUrl, authToken]);

 // Render loading and error states
 if (loading) {
  return <Shrimmer></Shrimmer>;
 }

 if (error) {
  return <div>{error}</div>;
 }

 // Toggle course selection and update selected courses state
 const handleCourseSelection = (course: { id: number; name: string }) => {
  // Check if the course is already selected
  const isSelected = selectedCourses.some(
   (selectedCourse) => selectedCourse.id === course.id
  );

  // Toggle the selection state
  if (isSelected) {
   setSelectedCourses(selectedCourses.filter((c) => c.id !== course.id));
  } else {
   setSelectedCourses([...selectedCourses, course]);
  }
 };

 return (
  <LazyLoad>
   <div
    className="bg-neutral-white border rounded-2xl md:p-6 p-4 md:px-6 md:py-5"
    style={{ border: "1px solid #EDEEF2" }}>
    <div className="flex items-center mb-6  gap-4">
     <div
      className="md:w-8 md:h-8 w-6 h-6 rounded-full flex items-center flex-shrink-0 justify-center"
      style={{ backgroundColor: "hsl(var(--primary))" }}>
      <span className="text-primary-foreground font-bold">4</span>
     </div>
     <h2 className="text-primary-text md:text-2xl text-xl font-bold">
      What Courses Would You Like?
     </h2>
    </div>

    <div className="md:ml-12">
     <p
      style={{
       color: "#545563",
       fontSize: "14px",
       fontWeight: "400",
       marginBottom: "16px",
      }}>
      (You can select multiple options)
     </p>

     <div className="grid md:grid-cols-4 gap-6">
      {courseTypes.map((course) => (
       <Button
        key={course.id}
        onClick={() =>
         handleCourseSelection({ id: course.id, name: course.name })
        }
        style={{
         fontSize: "16px",
         height: "80px",
         backgroundColor: selectedCourses.some(
          (selectedCourse) => selectedCourse.id === course.id
         )
          ? "#EAF5FF"
          : "#fff",
         color: "#2B2B43",
         fontWeight: "400",
         borderRadius: "16px",
         padding: "10px",
         width: "245px",
         border: selectedCourses.some(
          (selectedCourse) => selectedCourse.id === course.id
         )
          ? "1px solid #054A86"
          : "1px solid #C7C8D2",
         display: "flex",
         alignItems: "center",
         justifyContent: "flex-start",
        }}>
        <img
         src={course.image_url}
         alt={course.name}
         style={{
          width: "60px",
          height: "60px",
          marginRight: "8px",
         }}
        />
        <span style={{ textAlign: "left" }}>{course.name}</span>
       </Button>
      ))}
     </div>
    </div>

    <div className="flex justify-between mt-8">
     <Button
      onClick={handleGoBack}
      className="bg-[#C7C8D2] text-white cursor-pointer"
      style={{
       padding: "12px 16px",
       borderRadius: "8px",
       fontSize: "14px",
       fontWeight: "700",
       color: "#054A86",
       border: "1px solid #054A86",
       backgroundColor: "#fff",
      }}>
      Go Back
     </Button>
     <Button
      onClick={handleContinue}
      disabled={selectedCourses.length === 0}
      className={`bg-[#054A86] text-white hover:bg-[#054A86] hover:bg-opacity-70 ${
       selectedCourses.length === 0 ? "cursor-not-allowed" : ""
      }`}
      style={{
       padding: "12px 16px",
       borderRadius: "8px",
       fontSize: "16px",
       fontWeight: "600",
       boxShadow: "0px 8px 20px 0px #4E60FF29",
      }}>
      Continue
     </Button>
    </div>
   </div>
  </LazyLoad>
 );
};

export default CourseSelection;
