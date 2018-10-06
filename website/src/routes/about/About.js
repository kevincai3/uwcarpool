import React from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import classNames from 'classnames';
import s from './About.css';

import Layout from '../../components/Layout/Layout.js';
import Collapse from '../../components/Collapse/Collapse.js';
import LoadingSpinner from '../../components/Loading/LoadingSpinner.js';
import faq from './text.js';

class About extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      form: {
        name: '',
        email: '',
        message: '',
      },
      // 0 -> Default, 1 -> Error, 2 -> Sending, 3 -> Complete
      formState: 0,
      submission: null,
    }
  }

  updateForm = (name, val) => {
    this.setState({
      form: {
        ...this.state.form,
        [name]: val
      },
      formState: this.formState === 1 ? 0 : this.formState,
    })
  }

  submitForm = (e) => {
    e.preventDefault();
    if (this.state.form.message.trim() == '') {
      this.setState({formState: 1});
      return;
    }
    const submission = this.props.fetch("/api/feedback", {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      method: "POST",
      body: JSON.stringify({
        data: this.state.form,
      })
    }).then(() => {
      if (this.state.submission !== null) {
        this.setState({
          formState: 3,
          submission: null,
        })
      }
    })
      .catch(err => console.log(err));

    this.setState({
      formState: 2,
      submission,
    });
  }

  componentWillUnmount() {
    this.setState({
      submission: null,
    })
  }

  render (){
    const { formState } = this.state;
    const { name, email, message } = this.state.form;
    const form = (
      <form>
        <div className={s.input_row}>
          <div className={s.input_group}>
            <label htmlFor="name" className={s.input_label}>Name (optional):</label>
            <input name="name" className={s.input_box} value={name} onChange={(e) => this.updateForm('name', e.target.value)} />
          </div>
          <div className={s.input_group}>
            <label htmlFor="email" className={s.input_label}>Email (optional):</label>
            <input name="email" className={s.input_box} value={email} onChange={(e) => this.updateForm('email', e.target.value)} />
          </div>
        </div>
        <div className={s.message_row}>
          <label htmlFor="message">Message: </label>
          <textarea name="message" className={classNames(s.textarea, (formState === 1) && s.error_textarea)} value={message} onChange={(e) => this.updateForm('message', e.target.value)}/>
        </div>
        <div className={s.submit_row}>
          <button type="submit" className={classNames("button", "dynamic_button", s.button)} disabled={formState === 2} onClick={this.submitForm}>
            <span style={formState === 2 ? { opacity: 0 } : {}}>Submit</span>
            {formState === 2 && <LoadingSpinner styles={{
              margin: '0 auto',
              width: 4,
              height: 4,
              fontSize: 4,
              marginTop: -17,
              color: 'var(--color-default-background)',
            }}/> }
          </button>
        </div>
      </form>
    )

    return (
      <div>
        <div className={s.title}>
          Frequently Asked Questions
        </div>
        <div className={s.body}>
          <Collapse items={faq}/>
          <div className={s.feedback}>
            <div className={s.feedback_title}>
              {
                formState === 3 ?
                'Thanks for your feedback!' :
                'Got a question? Have some suggestions? Leave us a comment!'
              }
            </div>
            {
              formState === 3 ?
                null:
                form
            }
          </div>
        </div>
      </div>
    )
  }
}



export default withStyles(s)(About)
