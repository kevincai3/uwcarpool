import React from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import classNames from 'classnames';
import s from './About.css';

import Layout from '../../components/Layout/Layout.js';
import Collapse from '../../components/Collapse/Collapse.js';
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
      completedForm: false,
    }
  }

  updateForm = (name, val) => {
    this.setState({
      form: {
        ...this.state.form,
        [name]: val
      }
    })
  }

  submitForm = (e) => {
    e.preventDefault();
    if (this.state.form.message.trim() == '') {
      return;
    }
    this.props.fetch("/api/feedback", {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      method: "POST",
      body: JSON.stringify({
        data: this.state.form,
      })
    }).then(() => this.setState({completedForm: true}))
      .catch(err => console.log(err));
  }

  render (){
    const { completedForm } = this.state;
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
          <textarea name="message" className={s.textarea} value={message} onChange={(e) => this.updateForm('message', e.target.value)}/>
        </div>
        <div className={s.submit_row}>
          <input type="submit" className={classNames("button", s.button)} onClick={this.submitForm} />
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
                completedForm ?
                'Thanks for your feedback!' :
                'Got a question? Have some suggestions? Leave us a comment!'
              }
            </div>
            {
              completedForm ?
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
