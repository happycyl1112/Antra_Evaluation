/* ~~~~~~~~~~~~~~~~ Api ~~~~~~~~~~~~~~~~ */
export const Api = (() => {
    // const baseUrl = 'https://jsonplaceholder.typicode.com';
    const baseUrl = 'http://localhost:4232';
    const resourcePath = 'courseList';
    const myPath = 'myCourseList';

  
    const getCourseList = () =>
      fetch([baseUrl, resourcePath].join('/')).then((response) => response.json());
    const deleteCourse = (id) =>
      fetch([baseUrl, resourcePath, id].join('/'), {
      method: 'DELETE',
    });
    const initCourseList = () => {
      getCourseList().then((courses) => {
          let myCourses = [];
          //console.log(courses);
          courses.forEach((course)=>{
            course.selected = false;
            course.courseId = course.courseId + 100;
            console.log(JSON.stringify(course));
            //fetch([baseUrl, resourcePath, course.id].join('/'),
            //  {method: 'DELETE'}
            //).then(()=>
              fetch([baseUrl, resourcePath].join('/'), 
              {
                method: 'POST',
                body: JSON.stringify(course),
                headers: {
                  'Content-type': 'application/json; charset=UTF-8',
                }
              }
              ).then((response)=>response.json())
            //)

          })
    })
  };
  
    return {
        getCourseList,
        initCourseList
    };
  })();