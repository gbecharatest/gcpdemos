import React, { useState } from 'react';
import { Button, Form } from 'semantic-ui-react'
import { Link } from 'react-router-dom';
import { FormErrors } from './FormErrors';
import { View, StyleSheet, Text } from 'react-native';
import axios from 'axios';


export default function AskLLM() {
  return (<AskBard />);
}


class AskBard extends React.Component {

    constructor(props) {
      super(props);
  
      this.state = {
        prompt: '',
        promptValid: false,
        formErrors: {prompt: ''},
        formValid: false,
        promptresponse: '',
        characterCount: 0,
        promptchatbisonresponse: '',
        prompttextbisonresponse: '',
      }

      this.handleChange = this.handleChange.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);
      this.callChatBison = this.callChatBison.bind(this);
      this.callTextBison = this.callTextBison.bind(this);

    }

  refresh() {
    window.location.reload();
  }
  
  handleChange(event) {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;
  
    this.setState(
      {[name]: value, }, () => { this.validateField(name, value)});
    };
  

  validateField(fieldName, value) {
    let fieldValidationErrors = this.state.formErrors;
    let promptValid = this.state.promptValid;
  
    this.updateCharacterCount();

    switch(fieldName) {
      case 'prompt':
        promptValid = value.length >= 2;
        fieldValidationErrors.promptValid = promptValid ? '': ' a prompt is should have at least 2 characters';
        break;
      default:
        break;
    }
    this.setState({formErrors: fieldValidationErrors,
                    promptValid: promptValid
                  }, this.validateForm,);
  }


  validateForm() {
    this.setState({formValid: this.state.promptValid});
  }
  
  errorClass(error) {
    return(error.length === 0 ? '' : 'has-error');
  }

  updateCharacterCount() {
    this.state.characterCount = this.state.prompt.length;
  }


  handleSubmit(event) {
    /*
    {
      "predictions":[
        {
        "safetyAttributes":{"categories":[],"blocked":false,"scores":[]},
        "citationMetadata":{
          "citations":[
            {"endIndex":148,"startIndex":22,"url":"http://lfop.delidate.it/mr-tonito-2020-mp3.html"}
          ]},
        "content":"Apple Watch Series 7, Apple Watch SE, Apple Watch Series 6, Apple Watch Series 5, Apple Watch Series 4, Apple Watch Series 3, Apple Watch Series 2, Apple Watch Series 1"}]
      }
      format 2 
      {"predictions":[
        {"candidates":[{"content":"The quote  is form the wonderful and extraordinary ","author":"1"}],
        "safetyAttributes":[{"categories":[],"blocked":false,"scores":[]}],
        "citationMetadata":[{"citations":[]}],"content":""}]}
    */

    console.log(`https://${process.env.REACT_APP_LLMHELPER_URL}/api/llm-helper/:Prompt=${encodeURIComponent(this.state.prompt)}`);
    
    /*window.$.get(`https://${process.env.REACT_APP_LLMHELPER_URL}/api/llm-helper/:${encodeURIComponent(this.state.prompt)}`, res => {  
      
      console.log("Réponse LLM2");
      console.log(res); 
      console.log(res.predictions);
      
      if (res.predictions[0].content.length){
        console.log(res.predictions[0].content);
        this.setState({
          promptresponse: res.predictions[0].content
        });
        } else
        {
        console.log(res.predictions[0].candidates[0].content);
        this.setState({
          promptresponse: res.predictions[0].candidates[0].content 
        });      
      };

    });*/
    axios.get(`https://${process.env.REACT_APP_LLMHELPER_URL}/api/llm-helper/:${encodeURIComponent(this.state.prompt)}`,
      {
        headers: {
          'Authorization': localStorage.getItem("access_token")&& localStorage.getItem("access_token")!='undefined'? `Bearer ${localStorage.getItem("access_token")}`:''
        }
      }
    )
    .then(res => {    
        
        console.log("Réponse LLM2");
        console.log(res.data); 
        console.log(res.data.predictions);
        
        if (res.data.predictions[0].content.length){
            console.log(res.data.predictions[0].content);
            this.setState({
              promptresponse: res.data.predictions[0].content
            });
          } else
          {
            console.log(res.data.predictions[0].candidates[0].content);
            this.setState({
              promptresponse: res.data.predictions[0].candidates[0].content 
            });      
          };

      });

  }

  callChatBison(event) {

    console.log(`https://${process.env.REACT_APP_LLMHELPER_URL}/api/llm-helper-chat-bison/:Prompt=${encodeURIComponent(this.state.prompt)}`);
    
    window.$.get(`https://${process.env.REACT_APP_LLMHELPER_URL}/api/llm-helper-chat-bison/:${encodeURIComponent(this.state.prompt)}`, res => {  
      
      console.log("Réponse LLM2");
      console.log(res); 
      console.log(res.predictions);
      
      console.log(res.predictions[0].candidates[0].content);
      this.setState({
        promptchatbisonresponse: res.predictions[0].candidates[0].content 
      });      

    });

  }

  callTextBison(event) {

    console.log(`https://${process.env.REACT_APP_LLMHELPER_URL}/api/llm-helper-text-bison/:Prompt=${encodeURIComponent(this.state.prompt)}`);
    
    window.$.get(`https://${process.env.REACT_APP_LLMHELPER_URL}/api/llm-helper-text-bison/:${encodeURIComponent(this.state.prompt)}`, res => {  
      
      console.log("Réponse LLM2");
      console.log(res); 
      console.log(res.predictions);
      
      console.log(res.predictions[0].content);
      this.setState({
        prompttextbisonresponse: res.predictions[0].content
      });


    });
    
  }

  render() {

    return (
      <div>

              <h3>Ask LLM</h3>
              
              {/* <Form className="create-form" onSubmit={this.handleSubmit} >*/}
              <Form className="create-form">
                <div className="panel panel-default">
                  <FormErrors formErrors={this.state.formErrors} />
                </div>
                <Form.Field >
                    <label>Hey Quotey who is the writer</label> <br/>
                    {/* <input name='prompt' placeholder='Enter the quote here' value={this.state.prompt} onChange={this.handleChange} style={{width: '350px'}}/><br/>*/}
                    <textarea id="prompt" maxLength="350" rows="3" cols="100" placeholder='Enter the quote here' name="prompt"  value={this.state.prompt} onChange={this.handleChange}></textarea>
                    {/* <label name='response'> {this.state.promptresponse} </label> */}
                </Form.Field>
                <div id="characterCount">{this.state.characterCount}</div>
                <Button type='submit' disabled={!this.state.formValid} onClick={this.handleSubmit}>Submit</Button>
                <div id="formattedResponse">
                    <Text>
                      {this.state.promptresponse.replace(/\n/g,'\n')}
                    </Text>
                </div>
                <Button type='submit' disabled={!this.state.formValid} onClick={this.callChatBison}>CallChatBison</Button>
                <div id="formattedResponse">
                    <Text>
                      {this.state.promptchatbisonresponse.replace(/\n/g,'\n')}
                    </Text>
                </div>
                <Button type='submit' disabled={!this.state.formValid} onClick={this.callTextBison}>CallTextBison</Button>
                <div id="formattedResponse">
                    <Text>
                      {this.state.prompttextbisonresponse.replace(/\n/g,'\n')}
                    </Text>
                </div>
              </Form>
      </div>

    )
}
}

