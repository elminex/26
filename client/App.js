import React, { Component } from 'React';
import { hot } from 'react-hot-loader';
import io from 'socket.io-client';

import styles from './css/App.css';

import MessageList from './MessageList';
import MessageForm from './MessageForm';
import UsersList from './UsersList';
import UserForm from './UserForm';
const socket = io('/');

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            users: [],
            messages: [],
            text: '',
            name: ''
        }
    }

    componentDidMount() {
        socket.on('message', message => this.messageRecieve(message));
        socket.on('update', ({ users }) => this.chatUpdate(users));
    }

    messageRecieve(message) {
        const messages = [...this.state.messages, message];
        this.setState({messages});
    }
    
    chatUpdate(users) {
        this.setState({users});
        console.log('updated users: ' + users)
    }

    handleMessageSubmit(message) {
        const messages = [...this.state.messages, message];
        this.setState({messages});
        socket.emit('message', message);
    }

    handleUserSubmit(name) {
        this.setState({ name });
        socket.emit('join', name);
    }

    renderUserForm() {
        return (<UserForm onUserSubmit={name => this.handleUserSubmit(name)} />);
    }

    renderLayout() {
        return (
            <div className={styles.App}>
                <div className={styles.AppHeader}>
                    <div className={styles.AppTitle}>
                        Chat App
                    </div>
                    <div className={styles.AppRoom}>
                        App Room
                    </div>
                </div>
                <div className={styles.AppBody}>
                    <UsersList users={this.state.users} />
                    <div className={styles.MessageWrapper}>
                        <MessageList messages={this.state.messages} />
                        <MessageForm onMessageSubmit={message => this.handleMessageSubmit(message)} name={this.state.name} />
                    </div>
                </div>
            </div>
        )
    }

    render() {
        return this.state.name !== '' ? this.renderLayout() : this.renderUserForm();
    }
}

export default hot(module)(App);