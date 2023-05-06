import {React,useEffect,useState} from "react";
import { Model } from "survey-core";
import { Survey } from "survey-react-ui";
import "survey-core/defaultV2.min.css";
import "../index.css";
import { json } from "./json";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
function SurveyComponent() {
    const navigate = useNavigate();
    const [id, setId] = useState('');
    useEffect(() => {
    axios.get('http://localhost:8081', { withCredentials: true })
      .then(res => {
        if (res.data.valid) {
          setId(res.data.id);
        } else {
          navigate('/sign-in');
        }
      })
      .catch(err => console.log(err));
    }, [navigate]);
    
    
    const survey = new Model(json);
    const quizData = JSON.parse(JSON.stringify(json.pages));

    survey.onComplete.add((sender, options) => {
        const quizResults = sender.data;
        const quizResult = {};

        quizData.forEach(page => {
            const radioGroupElementsOnPage = page.elements.filter(element => element.type === 'radiogroup');
            radioGroupElementsOnPage.forEach(element => {
                const questionName = element.name;
                const userAnswer = quizResults[questionName];
                const correctAnswer = element.correctAnswer;

                if (userAnswer === correctAnswer) {
                    quizResult[questionName] = true;
                } else {
                    quizResult[questionName] = false;
                }
            });
        });
        const score = Object.values(quizResult).filter(Boolean).length;
        axios.post("http://localhost:8081/score",{
         id:id,
         score:score,
         })
          .then((response) => {
          if(response.data.message){
            console.log(response.data.message)
          }else{
          navigate('/');
        }})


    });

    return (<Survey model={survey} />);
}

export default SurveyComponent;