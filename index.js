import React , {Component}from 'react'
import ReactDom from 'react-dom'
import TextField from 'material-ui/lib/text-field'
import Checkbox from 'material-ui/lib/checkbox'
import FlatButton from 'material-ui/lib/flat-button';
import Divider from 'material-ui/lib/divider';

import injectTapEventPlugin from 'react-tap-event-plugin'
//import {ipcRenderer} from 'electron'
const ipcRenderer = require('electron').ipcRenderer;

import './preference.css'

injectTapEventPlugin()

class Preference extends Component {
  constructor() {
    super()
    this.state = {setting:{}}
  }

  componentWillMount() {
    ipcRenderer.send('request-preference')
    ipcRenderer.on('request-preference-reply', (event, arg)=> {
      var setting = JSON.parse(arg)
      this.setState({setting: {autoStartup: setting.autoStartup, shortcut: setting.shortcut}})
      //this.shortcutInput.setValue(setting.shortcut)
      //this.startupCheckbox.setChecked(setting.autoStartup)
    });
  }

  handleCancel() {
    ipcRenderer.send('cancel-preference')
  }

  handleSave() {
    var newSetting = {autoStartup: this.startupCheckbox.isChecked(), shortcut: this.shortcutInput.getValue()};
    this.setState({setting: newSetting});
    ipcRenderer.send('save-preference', JSON.stringify(newSetting))
  }

  handleShortcutChange(e){
    this.setState({setting:{autoStartup:this.state.setting.autoStartup, shortcut:e.target.value}})
  }

  handleStartupChange(e, checked){
    this.setState({setting:{autoStartup:checked, shortcut:this.state.setting.shortcut}})
  }

  render() {
    return (
      <div>
        <div className="setting-grp">
          <Checkbox ref={(ref)=>this.startupCheckbox = ref} checked={this.state.setting.autoStartup}
                    onCheck={(e, checked)=>this.handleStartupChange(e,checked)}
                    label="Startup at login"/>
          <TextField ref={(ref)=>this.shortcutInput = ref} onChange={(e)=>this.handleShortcutChange(e)}
                     hintText="e.g. ctrl+esc, alt+s" value={this.state.setting.shortcut}
                     floatingLabelText="Input key binding here"/>
        </div>
        <div className="btn-grp">
          <FlatButton label="cancel" onClick={(e)=>this.handleCancel()}/>
          <FlatButton label="Save" secondary={true} onClick={(e)=>this.handleSave()}/>
        </div>
      </div>
    )
  }
}

ReactDom.render(<Preference/>, document.getElementById('root'))


