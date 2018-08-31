import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { addDays, format } from 'date-fns';
import getName from '../modules/getName';
import DatePicker from './DatePicker';
import '../css/Info.css';

class Info extends Component {
  // The infobox that pops up when clicking the 'i' icon on a reminder.
  constructor(props) {
    super(props);

    this.state = {
      link: '',
      date: '',
      notes: '',
      done: false,
    };

    this.linkInput = React.createRef();


    this.onLinkClick = this.onLinkClick.bind(this);
    this.onSaveClick = this.onSaveClick.bind(this);
    this.onCancelClick = this.onCancelClick.bind(this);
    this.onLinkChange = this.onLinkChange.bind(this);
    this.onNotesChange = this.onNotesChange.bind(this);
    this.drillDateChange = this.drillDateChange.bind(this);
  }

  componentWillMount() {
    const name = getName(this.props.item.link);
    this.setState({ name, ...this.props.item });
  }

  onLinkClick() {
    this.linkInput.current.select();
  }

  onLinkChange(e) {
    this.setState({ link: e.target.value });
  }

  onNotesChange(e) {
    this.setState({ notes: e.target.value });
  }

  onSaveClick() {
    // Save stuff the close the info screen.
    this.props.saveItem(this.state);
    if (this.props.existing) this.props.drillOpenInfo(false);
  }

  onCancelClick() {
    this.props.drillOpenInfo(false);
  }

  drillDateChange(days, weeks) {
    // Take week and days and turn them into a date string from now.
    const date = format(addDays(Date.now(), (days + (7 * weeks))), 'M/DD/YYYY');
    this.setState({ date });
  }

  render() {
    const { name, link, date, notes } = this.state;
    const { existing } = this.props;
    return (
      <section className="Info">
        <header className="primary">{name}</header>

        <div className="link">
          <header className="secondary">Link:</header>
          <input
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck="false"
            type="text"
            value={link}
            onClick={this.onLinkClick}
            onChange={this.onLinkChange}
            ref={this.linkInput}
            placeholder="Paste link here..."
          />
        </div>

        <div className="dateSelect">
          <header className="secondary">When?</header>
          <DatePicker initialDate={date} drillDateChange={this.drillDateChange} />
        </div>

        <div className="notes">
          <header className="secondary">Notes:</header>
          <textarea
            className="notesText"
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck="false"
            type="text"
            value={notes}
            onChange={this.onNotesChange}
            placeholder="Any notes about the problem can go here!"
          />
        </div>
        {existing
          ? (
            <Fragment>
              <button className="infoBtn cancel" onClick={this.onCancelClick} type="submit">
                Cancel
              </button>
              <button className="infoBtn" onClick={this.onSaveClick} type="submit">
                Save
              </button>
            </Fragment>
          )
          : (
            <button className="infoBtn" onClick={this.onSaveClick} type="submit">
              Save
            </button>
          )
        }

      </section>
    );
  }
}

Info.propTypes = {
  item: PropTypes.objectOf(PropTypes.oneOfType([PropTypes.string, PropTypes.bool])),
  existing: PropTypes.bool,
  drillOpenInfo: PropTypes.func,
  saveItem: PropTypes.func,
};

Info.defaultProps = {
  item: {},
  existing: false,
  drillOpenInfo: (() => { throw new ReferenceError('drillOpenInfo not passed to Info'); }),
  saveItem: (() => { throw new ReferenceError('saveItem not passed to Info'); }),
};

export default Info;
