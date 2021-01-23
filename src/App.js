import React,{useState,useEffect} from 'react' 
import './App.css';
import {MenuItem,FormControl, Select,Card, CardContent} from '@material-ui/core'
import InfoBox from './InfoBox';
import Table from './Table';
import { prettyPrintStat, sortData } from './util';
import LineGraph from './LineGraph'
import numeral from 'numeral'

function App() {

  const [states, setStates] = useState([])
  const [worldwide, setWorldWide] = useState('worldwide')
  const [stateInfo, setStateInfo] = useState({})
  const [tableData, setTableData] = useState([])
  const [casesType, setCasesType] = useState('cases')


  const API = 'https://disease.sh/v3/covid-19/gov/India'


  useEffect(() => {
       const getStateData = async () => {
        await fetch(API)
        .then(res => res.json())
        .then(data => {
          const stateData = data.states.map((state) => ({
            state: state.state,
            cases: state.cases,
          }))

          const sortedData = sortData(stateData)
          setTableData(sortedData)
          setStates(stateData)
        })
       }
       getStateData()

       // default displayed data
       fetch('https://disease.sh/v3/covid-19/all')
       .then(res => res.json())
       .then(data => {
         setStateInfo(data)
       })
  },[])

    const onStateChange = async (event) => {
      const stateName = event.target.value;
      
    let url = '';

    if(stateName === 'worldwide'){
      url = 'https://disease.sh/v3/covid-19/all'

      await fetch(url)
      .then(res => res.json())
      .then(data => {
        setWorldWide(stateName)
        setStateInfo(data)
      })
    } else {
      url = API 

      await fetch(url)
      .then(res => res.json())
      .then(data => {
        setWorldWide(stateName)
        let newState = data.states.filter( 
          eachObj => eachObj.state === stateName); 
        setStateInfo(newState[0])
      })
    }
 }

  return (
    <div className="app">
     <div className="app-header">
      <h1>Covid <span>Tracer</span></h1>
    <FormControl>
      <Select
      style={{
        "background":'#fff',
        'color':'rgb(39, 13, 82)',
        'font-size':'1.5rem',
        'text-align':'center',
        'border-radius':'25px',
        'font-family':'serif',
        'font-weight': 'bold'
      }}
      variant='outlined' value={worldwide} onChange={onStateChange}>
      <MenuItem
      value='worldwide'>WorldWide</MenuItem> 
    {states.map( state => <MenuItem value={state.state}>{state.state}</MenuItem> )}
      </Select>
    </FormControl>
      </div>

    <div className="app-stats">
    <InfoBox
            onClick={(e) => setCasesType("cases")}
            title="Coronavirus Cases"
            isRed
            active={casesType === "cases"}
            cases={prettyPrintStat(stateInfo.todayCases)}
            total={numeral(stateInfo.cases).format("0.0a")}
          />
          <InfoBox
            onClick={(e) => setCasesType("recovered")}
            title="Recovered"
            active={casesType === "recovered"}
            cases={prettyPrintStat(stateInfo.todayRecovered)}
            total={numeral(stateInfo.recovered).format("0.0a")}
          />
          <InfoBox
            onClick={(e) => setCasesType("deaths")}
            title="Deaths"
            isRed
            active={casesType === "deaths"}
            cases={prettyPrintStat(stateInfo.todayDeaths)}
            total={numeral(stateInfo.deaths).format("0.0a")}
          />
    </div>

    <Card>
    <CardContent>
      <h3>Live Cases by States</h3>
    <Table states = {tableData} />
      <h3 className="cases">Cases</h3>
    <LineGraph className='line'
    casesType={casesType} />
    <h3 className="recovered">Recovered</h3>
    <LineGraph casesType='recovered' />
    <h3 className="deaths">Deaths</h3>
    <LineGraph casesType='deaths' />
    </CardContent>
     </Card>

    </div>
  );
}

export default App;
