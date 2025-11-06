const Header = ({ name }) => <h1>{name}</h1>;
const Content = ({ parts }) => (
  <div>
    {parts.map((part) => (
      <Part key={part.id} part={part} />
    ))}
  </div>
);



const Part = (props) => (
  <li>
    {props.part.name} {props.part.exercises}
  </li>
);
const Summary = ({ parts }) => {
  const total = parts.reduce((sum, part) => sum + part.exercises, 0);
  return <p><strong>Total exercises:</strong> {total}</p>;
};

const Course = ({ course }) => (
  course.map((course) => (
    <div key={course.id}>
      <Header name={course.name} />
      <Content parts={course.parts} />
      <Summary parts={course.parts} />
    </div>
  ))
);
export default Course;