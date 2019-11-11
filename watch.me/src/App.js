import React, { Component } from 'react'
import { Input, Label, Menu,Header, Icon } from 'semantic-ui-react'
import './App.css';
// import style from './App.css';
export default class App extends Component {
  state = { activeItem: 'inbox' }

  handleItemClick = (e, { name }) => this.setState({ activeItem: name })

  render() {
    const { activeItem } = this.state

    return (
      <div>
      <Header style={{margin:'0px 30%'}} as='h4' icon>
    <Icon name='settings' />
    Watch Me
    <Header.Subheader>
    <span>&copy; Adobe </span>
    </Header.Subheader>
  </Header>
      <Menu vertical>
        <Menu.Item
          name='inbox'
          active={activeItem === 'inbox'}
          onClick={this.handleItemClick}
        >
          <Label color='teal'>1</Label>
          Notifications
        </Menu.Item>

        <Menu.Item
          name='spam'
          active={activeItem === 'spam'}
          onClick={this.handleItemClick}
        >
          <Label>51</Label>
          Running task
        </Menu.Item>

        <Menu.Item
          name='updates'
          active={activeItem === 'updates'}
          onClick={this.handleItemClick}
        >
          <Label>1</Label>
          Updates
        </Menu.Item>
      </Menu>
      </div>
    )
  }
}