import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

const styles = {
    card: {
        minWidth: 275,
    },
    bullet: {
        display: 'inline-block',
        margin: '0 2px',
        transform: 'scale(0.8)',
    },
    title: {
        marginBottom: 16,
        fontSize: 14,
    },
    pos: {
        marginBottom: 12,
    },
};

var ob = <div>test</div>
var ob2 = <div>test2</div>
var ob3 = ob+ob2;

class Favorite extends Component {
    constructor(props) {
        super(props)
        this.state = {

        }
    }

    render() {

        return (
            <div>
            {ob}
            {ob2}
            {ob3}
          </div>
        )
    };
}


export default withStyles(styles)(Favorite);
