// jshint esversion: 6
import { reactShinyInput } from 'reactR';

import DateTimePicker from 'react-datetime-picker';

import Calendar from 'react-datetime-slider-picker/dist/Calendar';
import TimePicker from 'react-datetime-slider-picker/dist/TimePicker';
import { AppBar, Tab, Button } from '@material-ui/core';
import { TabContext, TabList, TabPanel } from '@material-ui/lab';
import { CheckCircleOutline, Today, AccessTime } from '@material-ui/icons';
import Language from 'react-datetime-slider-picker/public/Language';

//import { makeStyles } from "@material-ui/core/styles";
//import TextField from "@material-ui/core/TextField";
import { DateTimePicker as MuiDateTimePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';

/* ~~~~ react-datetime-picker ~~~~ */

class RDPwidget extends React.PureComponent {

  constructor(props) {
    super(props);
    let v = this.props.value,
    date = new Date(//Date.UTC(
      v.date.year, v.date.month-1, v.date.date,
      v.time.hour, v.time.minute, v.time.second
    );
    this.state = {
      value: date
    };
    this.onChange = this.onChange.bind(this);
  }

  onChange(value) {
    let x = {
      date: {
        year: value.getFullYear(),
        month: value.getMonth() + 1,
        date: value.getDate()
      },
      time: {
        hour: value.getHours(),
        minute: value.getMinutes(),
        second: value.getSeconds()
      }
    };
    Shiny.setInputValue(this.props.shinyId + ":shinyDatetimePickers.date", x);
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

    const updateValue = (v) => {
      let value = new Date(
        v.date.year, v.date.month-1, v.date.date,
        v.time.hour, v.time.minute, v.time.second
      );
      this.onChange(value);
    };

    Shiny.addCustomMessageHandler("updateValue_" + this.props.shinyId, function(x) {
      updateValue(x);
    });

    return (
      <DateTimePicker
        onChange={this.onChange}
        value={this.state.value}
        format="y-MM-dd hh:mm:ss a"
        showLeadingZeros={true}
        clearIcon={null}
        calendarIcon={null}
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
      time: this.props.value.time,
      value: this.props.value.date,
      counter: 1,
      timepickerKey: 0,
      calendarKey: 0
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
    Shiny.setInputValue(this.props.shinyId + "_save", true, {
      priority: "event"
    });
  }

  // componentWillReceiveProps(nextProps) {
  //   alert("nextProps");
  //   let that = this;
  //   setTimeout(function() {
  //     Shiny.setInputValue(that.props.shinyId + ":shinyDatetimePickers.date", {
  //       date: nextProps.value.date,
  //       time: nextProps.value.time
  //     });
  //   }, 0);
  //   this.setState({ date: nextProps.value.date, time: nextProps.value.time });
  //   let tab = this.state.tab;
  //   this.setState({ tab: 1-tab });
  //   setTimeout(function() {
  //     that.setState({ tab: tab });
  //   }, 0);
  // }

  render() {

    const updateValue = (value) => {
      let date = value.date;
      let time = value.time;
      this.setState({
        date: date,
        time: time
      });
      let calendarKey = this.state.calendarKey;
      let timepickerKey = this.state.timepickerKey;
      let id = this.props.shinyId + ":shinyDatetimePickers.date";
      let that = this;
      setTimeout(function () {
        that.setState({ 
          calendarKey: calendarKey + 1,
          timepickerKey: timepickerKey + 1
        });
        Shiny.setInputValue(id, {
          date: date,
          time: time
        });
      }, 0);      
    };

    Shiny.addCustomMessageHandler("updateValue_" + this.props.shinyId, function(x) {
      updateValue(x);
    });

    const language = (this.props.language === 'ko') ? Language['ko'] : Language['en'];

    return (
      <div className='picker'>
        <div className='picker-tab'>
          <TabContext value={this.state.tab}>
            <AppBar position="static">
              <TabList
                onChange={(event, value) => this.onTabChange(value)}
              >
                <Tab 
                  value={0}
                  label={language.date} 
                  icon={<Today />} 
                  classes={{ selected: 'selected' }} 
                />
                <Tab 
                  value={1}
                  label={language.time} 
                  icon={<AccessTime />} 
                  classes={{ selected: 'selected' }} 
                />
              </TabList>
            </AppBar>
            <TabPanel value={0}>
              <div className='picker-form'>
                <Calendar
                  key={this.state.calendarKey}
                  language={this.props.language}
                  defaultValue={this.state.date}
                  onChange={(date) => this.onValueChange(true, date)}
                />
              </div>            
            </TabPanel>
            <TabPanel value={1}>
              <div className='picker-form'>
                <TimePicker
                  key={this.state.timepickerKey}
                  language={this.props.language}
                  enableSecond={this.props.enableSecond}
                  defaultValue={this.state.time}
                  onChange={(time) => this.onValueChange(false, time)}
                />
              </div>          
            </TabPanel>
          </TabContext>
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
  if(configuration.save) {
    let id = configuration.shinyId + ":shinyDatetimePickers.date";
    setTimeout(function () {
      Shiny.setInputValue(id, {
        date: value.date,
        time: value.time
      });
    }, 0);
  }

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

reactShinyInput('.datetimeSliderPicker', 'shinyDatetimePickers.datetimeSliderPicker', RDSPinput);



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
          label={this.props.label}
          disableFuture={this.props.disableFuture}
          disablePast={this.props.disablePast}
          size="medium"
          inputVariant="outlined"
          showTodayButton
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
      label={configuration.label}
      disableFuture={configuration.disableFuture}
      disablePast={configuration.disablePast}
    />
  );
};

reactShinyInput('.datetimeMaterialPicker', 'shinyDatetimePickers.datetimeMaterialPicker', MUIinput);
