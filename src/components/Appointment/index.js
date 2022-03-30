import React from "react";
import "components/Appointment/styles.scss";
import Header from "./Header";
import Show from "./Show";
import Empty from "./Empty";
import useVisualMode from "hooks/useVisualMode";
import Form from "./Form";
import Status from "./Status";
import Confirm from "./Confirm";

const EMPTY = "EMPTY";
const SHOW = "SHOW";
const CREATE = "CREATE";
const SAVING = "SAVING";
const DELETING = "DELETING";
const CONFIRM = "CONFIRM";

export default function Appointment(props) {
  const { mode, transition, back } = useVisualMode(
    props.interview ? SHOW : EMPTY
  );

  function save(name, interviewer) {
    //console.log(interviewer, " is interviewer");
    const interview = {
      student: name,
      interviewer
    };
    transition(SAVING);
    props
      .bookInterview(props.id, interview)
      .then(() => {
        transition(SHOW);
      })
    
  }

  function delInterview(id, interview){
    transition(DELETING);
    props
      .cancelInterview(props.id, interview)
      .then(() => {
        transition(EMPTY)
      });
  }

  //console.log("PROPS", props);

  // function appTime() {
  //   if (props.time) {
  //     return `Appointment at ${props.time}`
  //   } else {
  //     return `No Appointments`
  //   }
  // }
  //console.log("INTERVIEWERS: ", props.interview.interviewer);
  return (
    <article className="appointment">
      <Header time={props.time}/>
      {mode === EMPTY && <Empty onAdd={() => transition(CREATE)} />}
      {mode === SHOW && (

        <Show 
          //props={props.interview}
          student={props.interview.student}
          interviewer={props.interview.interviewer.name}
          onDelete={() => {
            transition(CONFIRM);
          }}
        />
      )}

      {mode === CREATE && (
        <Form
          interviewers={props.interviewers}
          onSave={save}
          onCancel={() => {
            back();
           }}
        />
      )}
      {mode === SAVING && <Status message="Saving..." />}
      {mode === CONFIRM && (
        <Confirm
          onConfirm={delInterview}
          onCancel={() => {
            transition(SHOW);
          }}
        />
      )}
      {mode === DELETING && <Status message="Deleting..." />}
    </article>
  );
}