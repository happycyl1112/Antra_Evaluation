
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
      subclass = 'course'
      if(course.selected)
        subclass += 'selected';
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
        if (course.selected) {
            tot += course.credit;
        }
    });
    return `<div class="submit"><p>Total Credit: ${tot}</p></div>`;;
  }

  return {
    domstr,
    render,
    createTmp,
    updateCredit
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

  return {
    Course,
    State,
  };
})(Api, View);

/* ~~~~~~~~~~~~~~~~ Controller ~~~~~~~~~~~~~~~~ */
const Controller = ((model, view) => {
  const available = [];

  const CourseList = () => {
    const availableCourses = document.querySelector(view.domstr.available);
    availableCourses.addEventListener('click', (event) => {
        
      if (event.target.nodeName === 'tr') {
        if (event.target.classList.includes('selected'))
          event.target.classList.remove('selected');
        else
          event.target.classList.add('selected');
      }
      state.addCourse()
    });
  };

  //handle submit
  const submit = () => {
    const canSubmit = document.querySelector(view.domstr.selected);
    selected.addEventListener('click', (event) => {
        if (event.target.updateCredit > 18) {
            alert("You can only choose up to 18 credits in one semester")
        } else {
            alert("You have chosen " + `${updateCredit}` + " credits for this semester. You cannot change once you submit. Do you want to confirm?"
            )

        }

    })
  }

  const init = () => {

  };

  const bootstrap = () => {
    init();
    CourseList();
  };

  return {
    bootstrap,
  };
})(Model, View);

//console.log(Api.getCourseList());
Api.initCourseList().then((resp) => console.log(resp));
//Controller.bootstrap();