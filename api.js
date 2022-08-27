/* ~~~~~~~~~~~~~~~~ Api ~~~~~~~~~~~~~~~~ */
export const Api = (() => {
    // const baseUrl = 'https://jsonplaceholder.typicode.com';
    const baseUrl = 'http://localhost:4232';
    const resourcePath = 'courseList';
    const myPath = 'myCourseList';

  
    const getCourseList = () =>
      fetch([baseUrl, resourcePath].join('/')).then((response) => response.json());

    const initCourseList = () => {
      let myCourses = [];
      getCourseList().then((courses) => {
          console.log(courses);
          courses.forEach((course)=>{
            console.log(course);
            course.selected = false;
            myCourses.push(course);
          })
      return(myCourses);
    })
  };
  
    return {
        getCourseList,
        initCourseList
    };
  })();