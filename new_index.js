import {Api} from './api.js'

//----------------------------View -------------------------------------- 
const View = (() => {
    //get HTML element
    const domstr = {
        available: '#courseAvailable',
        selected: '#courseSelected',
        credit:`#credit`,
        submit:`#submit`
      };

    const styles = {
        selected: 'courseSelected'
    };

    //replace element with tmp in HTML
    const render = (element, tmp) => {
        element.innerHTML = tmp
    }

    //when we click a course, the background color toggles
    const click = (element) => {
        element.classList.toggle(styles.selected);
    }

    //Once we submit, disable the select button
    const toggleButton = () => {
        const element = document.querySelector(domstr.submit);
        element.disabled = true;
    }

    //update the selected part
    const createTmp = (arr, header) => {
        let tmp = `<th scope="row">${header}</th>`;
        arr.forEach((course) => {
            tmp += `
                <tr class="available_course" id=${course.courseId} >
                <td>
                    <p>
                        ${course.courseName}
                    </p>
                    <p>
                        Course Type: ${course.required == 'true'? 'Compulsory': 'Elective'}
                    </p>
                    <p>
                        Course Credit: ${course.credit}
                    </p>
                </td>
            </tr>
      `
        }) 
        return tmp
    }

    //update the credit
    const curCredit = (credit) => {
        return `${credit}`
    }

    return {domstr, render, click, toggleButton, createTmp, curCredit}

})();

//  -------------------------- Model -------------------------------------------------- //communicate with view and api
const Model = ((api, view) => {

    class State{
        #courseState = []; //courses listing
        #clickState = []; //clicked course
        #submitState = []; //submitted course
        #credit = 0;

        get courseState() {
            return this.#courseState;
        }

        //replace the previous course list with the cur course list through view 
        set courseState(courses) {
            this.#courseState = courses
            const tmp = view.createTmp(this.#courseState, 'Available Courses'); //update the course listing by call view function
            const element = document.querySelector(view.domstr.available);
            view.render(element, tmp);
            //view.toggleButton();
        }

        get clickState() {
            return this.#clickState;
        }

        set clickState(click) {
            //console.log(+click.id)
            if (this.#clickState.includes(+click.id)) {
                this.#clickState = [...this.#clickState.filter((id) => id !== +click.id)]
            } else {
                this.#clickState = [...this.#clickState, +click.id]
            }
            view.click(click)
        }


        get credit() {
            return this.#credit;
        }

        set credit(credit) {
            this.#credit = credit
            const element = document.querySelector(view.domstr.credit);
            const tmp = view.curCredit(this.#credit);
            view.render(element, tmp);
        }

        get submitState(){
            return this.#submitState;
        }

        set submitState(submitted) {
            this.#submitState = submitted

            const tmp = view.createTmp(this.#submitState, "Selected courses");
            const element = document.querySelector(view.domstr.selected);
            view.render(element, tmp);
            //view.toggleButton();
        }

    }
    const {getCourseList, initCourseList} = api;

    return {getCourseList, initCourseList, State}

})(Api, View);




//------------------------------- Controller ----------------------------

const Controller = ((model, view) => {
    const state = new model.State();

    const init = () => {
        model.getCourseList().then((data) => {
            state.courseState = data;
            state.submitState = [];
            state.credit = 0;
        })
    }

    //handle click event
    const clickCourse = () => {
        const element = document.querySelector(view.domstr.available);
        const submit = document.querySelector(view.domstr.submit);
        let target = undefined;
        element.addEventListener('click', (event) => {
            if (submit.disabled)
                return;
            target = event.target;
            
            while(!target.classList.contains("available_course")){
                target = target.parentElement;
            }
            const course = state.courseState[+target.id - 1];

            if (!state.clickState.includes(course.courseId)) {
                if ((course.credit + state.credit) > 18) {
                    alert ("You can only choose up to 18 credits in one semester")
                } else { 
                    state.credit += course.credit;
                    state.clickState = target;
            } 
            } else {
                //console.log(state.clickCourse);
                state.credit -= course.credit
                state.clickState = target;
            }
        })
    }
        //handle submit event
        const submit = () => {
            const element = document.querySelector(view.domstr.submit)
            element.addEventListener('click', (event) => {
                if (confirm(`You have chosen ${state.credit} credits for this semester. You cannot change once you submit. Do you want to confirm?`)) {
                    //console.log(state.courseState);
                    //console.log(state.clickState);
                    
                    state.submitState = state.courseState.filter((course)=> {
                        return state.clickState.includes(course.courseId)
                    });

                    state.courseState = state.courseState.filter((course) => {
                        return !state.clickState.includes(course.courseId)
                    });

                    view.toggleButton();
                }

            })
        }

    

    
    const bootstrap = () => {
        init();
        clickCourse();
        submit();
    }
    return {bootstrap}

})(Model, View);

Controller.bootstrap();
