/* ~~~~~~~~~~~~~~~~ Api ~~~~~~~~~~~~~~~~ */
export const Api = (() => {
    // const baseUrl = 'https://jsonplaceholder.typicode.com';
    const baseUrl = 'http://localhost:4232';
    const resourcePath = 'courseList';
  
    const getCourseList = () =>
      fetch([baseUrl, resourcePath].join('/')).then((response) => response.json());

  
    return {
        getCourseList
    };
  })();