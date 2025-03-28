import React, { useState , useRef} from 'react';
import ActiveLearning from './ActiveLearning';
import axios from 'axios';
import Select from 'react-select';
import './MLConfig.css';
import './Dashboard_sidebar.css';
import Results from './Results';
import './ImportCSV.css';

const MLdropdown = () => {
    const [learning, setLearning] = useState(null);
    const [report, setReport] = useState(null);
    const [accuracy, setAccuracy] = useState(null);
    const [stopTime, setStopTime] = useState(null);
    const [f1_score, setF1Score] = useState(null);
    const [graph, setGraph] = useState(false);
    const [confusionMatrix, setConfusionMatrix] = useState(false);
    const [fp, setFP] = useState(false);
    const [fn, setFN] = useState(false);
    const [tp, setTP] = useState(false);
    const [cv_mean, setCV] = useState(null);
    const [baseModel, setBaseModel] = useState(null); 
    const [supervisedSubOption, setSupervisedSubOption] = useState(null);
    const [isLearningSelected, setIsLearningSelected] = useState(false);
    const resultsRef = useRef();

    const baseModelOptions = [
        { value: 'supervised', label: 'Supervised Learning' },
        { value: 'activeLearning', label: 'Active Learning' }
    ];

    const supervisedSubOptions = [
        { value: 'logistic_regression', label: 'Logistic Regression' },
        { value: 'naive_bayes', label: 'Naive Bayes' },
        { value: 'random_forest', label: 'Random Forest' },
        { value: 'support_vector_machine', label: 'Support Vector Machine' },
        { value: 'decision_tree', label: 'Decision Tree' }
    ];

    const handleModelChange = (selectedOption) => {
        setBaseModel(selectedOption);
        handleLearningSelect(selectedOption.value);
    };

    const handleSupervisedSubModelChange = (selectedOption) => {
        setSupervisedSubOption(selectedOption);
        handleOptionSelect(selectedOption.value);
    };

    const handleLearningSelect = async (selectedValue) => {
        setIsLearningSelected(true); // Set the variable to true if any learning option is selected

        const headers = {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
            "X-Requested-With": "XMLHttpRequest"
        };

        if (selectedValue === 'supervised') {
            try {
                const response = await axios.post('https://roibackend.shaktilab.org/weekly-supervised', {}, { headers: headers });
                console.log(response.data);
                if (response.data.success) {
                    setLearning('supervised');
                }
            } catch (error) {
                console.error(error);
            }
        } else if (selectedValue === 'activeLearning') {
            try {
                const response = await axios.post('https://roibackend.shaktilab.org/active-learning', {}, { headers: headers });
                console.log(response.data);
                if (response.data.success) {
                    setLearning('activeLearning');
                }
            } catch (error) {
                console.error(error);
            }
        }
    };

    const handleOptionSelect = async (selectedValue) => {

        const headers = {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
            "X-Requested-With": "XMLHttpRequest"
        };

        let endpoint = "";
        switch (selectedValue) {
            case 'logistic_regression':
                endpoint = 'logistic-regression';
                break;
            case 'naive_bayes':
                endpoint = 'naive-bayes';
                break;
            case 'random_forest':
                endpoint = 'random-forest';
                break;
            case 'support_vector_machine':
                endpoint = 'support-vector-machine';
                break;
            case 'decision_tree':
                endpoint = 'decision-tree';
                break;
            default:
                return;
        }

        try {
            const response = await axios.post(`https://roibackend.shaktilab.org/${endpoint}`, {}, { headers: headers });
            console.log(`https://roibackend.shaktilab.org/${endpoint}`);
            console.log(response.data);
            if (response.data.success) {
                setReport(response.data.report);
                setAccuracy(response.data.accuracy);
                setStopTime(response.data.stop);
                setGraph(response.data.graph);
                setConfusionMatrix(response.data.cm);
                setF1Score(response.data.f1);
                setFP(response.data.fp);
                setFN(response.data.fn);
                setTP(response.data.tp);
                setCV(response.data.cv_mean);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const fetchGraphData = () => {
        if (resultsRef.current) {
          resultsRef.current.fetchGraphData();
        }
      };
    
      const resetGraphData = () => {
        if (resultsRef.current) {
          resultsRef.current.resetGraphData();
        }
      };

    return (
        <div className="container">
            <div className='section'>
                <div className='upload-sidebar subsection'>
                    <Select
                        options={baseModelOptions}
                        value={baseModel}
                        onChange={handleModelChange}
                        placeholder="ML Type"
                        className='ml-sidebar-item'
                    />
                    {baseModel && baseModel.value === 'supervised' && (
                        <Select
                            options={supervisedSubOptions}
                            value={supervisedSubOption}
                            onChange={handleSupervisedSubModelChange}
                            placeholder="Sub Model"
                            className='ml-sidebar-item'
                        />
                    )}
                    {baseModel && baseModel.value === 'activeLearning' && <ActiveLearning />}
                    <button className={`upload-button ${isLearningSelected ? 'button--primary--yellow' : 'button--primary--blue'}`} onClick={fetchGraphData}>
                        Update
                    </button>
                    {/* <button className={`upload-button button--primary--blue`} onClick={resetGraphData}>
                        Reset
                    </button> */}
                </div>
            </div>
            
            <div className="ml-table-section section" style={{color: '#28a9e2'}}>
                {learning === 'supervised' && report && (
                    <React.Fragment>
                        <div className="subsection report-subsection">
                            <div className="report-content">
                                <div className='accuracy-report-subsection report-inside-item'>
                                    <div className="report-tile">
                                        <div className="report-tile-title">Accuracy</div>
                                        <div className="report-tile-value">{accuracy}</div>
                                    </div>
                                    <div className="report-tile">
                                        <div className="report-tile-title">CV score</div>
                                        <div className="report-tile-value">{cv_mean}</div>
                                    </div>
                                    <div className="report-tile">
                                        <div className="report-tile-title">F1 Score</div>
                                        <div className="report-tile-value">{f1_score}</div>
                                    </div>
                                    <div className="report-tile">
                                        <div className="report-tile-title">Execution Time</div>
                                        <div className="report-tile-value">{stopTime} seconds</div>
                                    </div>
                                </div>
                                
                                <pre className='classification-table report-inside-item'>
                                    <u>
                                    <b className='report-tile-title'>Classification Report</b> <br /><br />
                                    </u>
                                    <div className='inner-classification-table'>
                                        {report}
                                    </div>
                                </pre>

                                <img src={graph} alt="Graph" />
                                <img src={confusionMatrix} alt="Confusion Matrix"/>
                            </div>
                        </div>
                    </React.Fragment>
                )}
                <Results ref={resultsRef}/>
            </div>
        </div>
    );
};

export default MLdropdown;
