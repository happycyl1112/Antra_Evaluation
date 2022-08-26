
import { Api } from './api.js'

/* ~~~~~~~~~~~~~~~~ View ~~~~~~~~~~~~~~~~ */
const View = (() => {
  const domstr = {
    available: '#courseAvailable',
    selected: '#courseSelected',
  };

  const render = (ele, tmp) => {
    ele.innerHTML = tmp;
  };

  const createTmp = (arr, head) => {
    let tmp = `<th scope="row">${head}</th>`;
    arr.forEach((course) => {
      subclass = ''
      if(course.selected)
        subclass+=' selected';
      tmp += `
            <tr class=${subclass}>
                <td>
                    <p>
                        ${course.name}
                    </p>
                    <p>
                        Course Type: ${course.type}
                    </p>
                    <p>
                        Course Credit: ${course.credit}
                    </p>
                </td>
            </tr>
      `;
    });
    return tmp;
  };
  
  //update tot credit
  const updateCredit = (arr) => {
    let tot = 0;
    arr.forEach((course) => {
        let credit = `<div class="submit"><p>Total Credit: ${tot}</p></div>`
        if (course.selected) {
            tot += course.credit;
            credit = `<div class="submit"><p>Total Credit: ${tot}</p></div>`
        }
    })
    return tot;
  }


  return {
    domstr,
    render,
    createTmp,
  };
})();

/* ~~~~~~~~~~~~~~~~ Model ~~~~~~~~~~~~~~~~ */
const Model = ((api, view) => {
  class Course {
    constructor(courseId, courseName, required, credit) {
      this.courseId = courseId;
      this.courseName = courseName;
      if(required)
        this.type = 'Compulsory';
      else
        this.type = 'Elective';
      this.credit = credit;
      this.selected = false;
    }
  }
  class State {
    #courselist = [];

    constructor(qstring){
        this.qstring = qstring
    }

    addCourse(course){
        this.#courselist.push(course);
    }

    get courses() {
      return this.#courselist;
    }
    set courses(newcourses) {
      this.#courselist = [...newcourses];

      const courseContainer = document.querySelector(qstring);
      let head = '';
      if(qstring=view.domstr.available)
        head = 'Available Courses'
      else
        head = 'Selected Courses';
      const tmp = view.createTmp(this.#courselist, head);
      view.render(courseContainer, tmp);
    }
  }


  const getCourseList = () => {
    let ret = new this.State();
    api.getCourseList.foreach((course) =>
    {
        ret.addCourse(new this.Course(course.courseId, course.courseName, course.required, course.credit))
    })
    return(ret);
  };

  return {
    getCourseList,
    Course,
    State,
  };
})(Api, View);

/* ~~~~~~~~~~~~~~~~ Controller ~~~~~~~~~~~~~~~~ */
const Controller = ((model, view) => {
  const available = model.getCourseList();
  const selected = new model.State();

  const deleteTodo = () => {
    const availableCourses = document.querySelector(view.domstr.available);
    available.addEventListener('click', (event) => {
        
      if (event.target.nodeName === 'tr') {
        if (event.target.classList.includes('selected'))
          event.target.classList.remove('selected');
        else
          event.target.classList.add('selected');
      }
      state.addCourse()
    });
  };


  const init = () => {
    model.getCourseList().then((todos) => {
      state.todolist = [...todos.reverse()];
    });
  };

  const bootstrap = () => {
    init();
    deleteTodo();
    addTodo();
  };

  return {
    bootstrap,
  };
})(Model, View);

Controller.bootstrap();
