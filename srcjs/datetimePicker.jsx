// jshint esversion: 6
import { reactShinyInput } from 'reactR';

import DateTimePicker from 'react-datetime-picker';

import Calendar from 'react-datetime-slider-picker/dist/Calendar';
import TimePicker from 'react-datetime-slider-picker/dist/TimePicker';
import { Tabs, Tab, Button } from '@material-ui/core';
import { CheckCircleOutline, Today, AccessTime } from '@material-ui/icons';
import Language from 'react-datetime-slider-picker/public/Language';

//import { makeStyles } from "@material-ui/core/styles";
i//mport TextField from "@material-ui/core/TextField";
import { DateTimePicker as MuiDateTimePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';

/* ~~~~ react-datetime-picker ~~~~ */

class RDPwidget extends React.PureComponent {

  constructor(props) {
    super(props);
    let v = this.props.value,
    date = new Date(Date.UTC(
      v.date.year, v.date.month-1, v.date.date,
      v.time.hour, v.time.minute, v.time.second
    ));
    this.state = {
      value: date
    };
    this.onChange = this.onChange.bind(this);
  }

  onChange(value) {
    let x = {
      date: {
        year: value.getUTCFullYear(),
        month: value.getUTCMonth() + 1,
        date: value.getUTCDate()
      },
      time: {
        hour: value.getUTCHours(),
        minute: value.getUTCMinutes(),
        second: value.getUTCSeconds()
      }
    };
    Shiny.setInputValue(this.props.shinyId + ":shinyDatetimePickers.date", x);
    console.log("value", x);
    this.setState({ value: value });
  }

  componentDidMount() {
    let that = this;
    setTimeout(function(){
      that.onChange(that.state.value);
    },0);
  }

  // jshint ignore: start
  render() {
    return (
      <DateTimePicker
        onChange={this.onChange}
        value={this.state.value}
        format="y-MM-dd hh:mm:ss a"
        showLeadingZeros={true}
        clearIcon={null}
        amPmAriaLabel="Select AM/PM"
        calendarAriaLabel="Toggle calendar"
        clearAriaLabel="Clear value"
        dayAriaLabel="Day"
        hourAriaLabel="Hour"
        maxDetail="second"
        minuteAriaLabel="Minute"
        monthAriaLabel="Month"
        nativeInputAriaLabel="Date and time"
        secondAriaLabel="Second"
        yearAriaLabel="Year"      
      />
    );
  }
  // jshint ignore: end

}

// jshint ignore: start
const RDPinput = ({ configuration, value, setValue }) => {
  return (
    <RDPwidget 
      shinyId={configuration.shinyId}
      value={configuration.value}
    />
  );
};
// jshint ignore: end

reactShinyInput('.datetimePicker', 'shinyDatetimePickers.datetimePicker', RDPinput);



/* ~~~~ react-datetime-slider-picker ~~~~ */

class RDSPwidget extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      tab: 0,
      date: this.props.value.date,
      time: this.props.value.time
    };

    this.onTabChange = this.onTabChange.bind(this);
    this.onValueChange = this.onValueChange.bind(this);
    this.onSave = this.onSave.bind(this);
  }

  onTabChange(value) {
    this.setState({ tab: value });
  }

  onValueChange(isDate, value) {
    let date = this.state.date,
      time = this.state.time;
    if (isDate) {
      date = {
        year: value.year,
        month: value.month,
        date: value.date
      };
      this.setState({ date: date });
    } else {
      time = value;
      this.setState({ time: time });
    }
    if (!this.props.save) {
      let id = this.props.shinyId + ":shinyDatetimePickers.date";
      setTimeout(function () {
        Shiny.setInputValue(id, {
          date: date,
          time: time
        });
      }, 0);
    }
  }

  onSave() {
    Shiny.setInputValue(this.props.shinyId + ":shinyDatetimePickers.date", {
      date: this.state.date,
      time: this.state.time
    });
  }

  componentDidMount() {
    let state = this.state,
      id = this.props.shinyId + ":shinyDatetimePickers.date";
    setTimeout(function () {
      Shiny.setInputValue(id, {
        date: state.date,
        time: state.time
      });
    }, 0);
  }

  render() {
    const language = (this.props.language === 'ko') ? Language['ko'] : Language['en'];

    return (
      <div className='picker'>
        <div className='picker-tab'>
          <Tabs
            value={this.state.tab}
            onChange={(event, value) => this.onTabChange(value)}
            fullWidth
            textColor='inherit'
            classes={{ indicator: 'picker-tab-indicator' }}
          >
            <Tab 
              label={language.date} 
              icon={<Today />} 
              classes={{ selected: 'selected' }} 
            />
            <Tab 
              label={language.time} 
              icon={<AccessTime />} 
              classes={{ selected: 'selected' }} 
            />
          </Tabs>
        </div>
        <div className='picker-form'>
          {(this.state.tab === 0) ?
            <Calendar
              language={this.props.language}
              defaultValue={this.state.date}
              onChange={(date) => this.onValueChange(true, date)}
            /> :
            <TimePicker
              language={this.props.language}
              enableSecond={this.props.enableSecond}
              defaultValue={this.state.time}
              onChange={(time) => this.onValueChange(false, time)}
            />}
        </div>
        {this.props.save ?
          <div className='picker-footer'>
            <div onClick={() => this.onSave()}>
              <Button fullWidth><CheckCircleOutline />{language.save}</Button>
            </div>
          </div> :
          null}
      </div>
    );
  }
}


const RDSPinput = ({ configuration, value, setValue }) => {
  return (
    <RDSPwidget
      setShinyValue={setValue}
      value={value}
      shinyId={configuration.shinyId}
      enableSecond={configuration.second}
      save={configuration.save}
    />
  );
};

reactShinyInput('.datetimeSliderPicker', 'shinyDatetimePicker.datetimeSliderPicker', RDSPinput);



/* ~~~~ material-ui ~~~~ */

const styles = {
  container: {
    display: "flex",
    flexWrap: "wrap"
  },
  textField: {
    marginLeft: "1px",
    marginRight: "1px",
    width: 200
  }
};

class MUIwidget extends React.PureComponent {

  constructor(props) {
    super(props);
    let v = this.props.value,
      date = new Date(
      v.date.year, v.date.month-1, v.date.date,
      v.time.hour, v.time.minute, v.time.second
    ),
      iso = date.toISOString().substr(0,16);
    this.state = {
      value: date
    };
    this.onChange = this.onChange.bind(this);
  }

  onChange(value) {
    let date = new Date(value);
    let x = {
      date: {
        year: date.getFullYear(),
        month: date.getMonth() + 1,
        date: date.getDate()
      },
      time: {
        hour: date.getHours(),
        minute: date.getMinutes(),
        second: date.getSeconds()
      }
    };
    Shiny.setInputValue(this.props.shinyId + ":shinyDatetimePickers.date", x);
    console.log("x", x);
    console.log("value", value);
    this.setState({ value: value });
  }

  componentDidMount() {
    let that = this;
    setTimeout(function(){
      that.onChange(that.state.value);
    },0);
  }

  render() {
    return (
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <MuiDateTimePicker
          value={this.state.value}
          onChange={this.onChange}
          ampm={false}
          label="xxxx"
          size="medium"
        />
      </MuiPickersUtilsProvider>
/*       <form style={styles.container} noValidate>
        <TextField
          id="datetime-local"
          label="Next appointment"
          type="datetime-local"
          defaultValue={this.state.value}
          style={styles.textField}
          InputLabelProps={{
            shrink: true
          }}
          onChange={this.onChange}
        />
      </form>
 */    );
  }

}


const MUIinput = ({ configuration, value, setValue }) => {
  return (
    <MUIwidget 
      shinyId={configuration.shinyId}
      value={configuration.value}
    />
  );
};

reactShinyInput('.datetimeMaterialPicker', 'shinyDatetimePickers.datetimeMaterialPicker', MUIinput);
