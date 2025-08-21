import BackButton from "@/components/BackButton";
import Todo from "@/components/Todo";
import React from "react";

const TodoPage = () => {
  return (
    <div className="relative">
      <div className="bg-transparent absolute top-3 left-3 ">
        <BackButton />
      </div>
      <Todo />
    </div>
  );
};

export default TodoPage;
