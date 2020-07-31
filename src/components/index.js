import React, { useState, useEffect } from 'react';
import Input from '@material-ui/core/Input';
import { InputLabel, Dialog, DialogContent, DialogContentText, DialogTitle, Slide, CircularProgress } from '@material-ui/core';
import InputAdornment from '@material-ui/core/InputAdornment';
import FormControl from '@material-ui/core/FormControl';
import AccountCircle from '@material-ui/icons/AccountCircle';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import axios from 'axios';
import love from '../love_icon.jpg'


const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const useStyles = makeStyles((theme) => ({
    button: {
        margin: theme.spacing(1),
    },
    inputStyle: {
        margin: '10px'
    },
    buttonStyle: {
        margin: '10px'
    },
    buttonCss: {
        width: '30%',
        backgroundColor: '#FF1493 !important'
    },
    root: {
        minWidth: 275,
    },
    bullet: {
        display: 'inline-block',
        margin: '0 2px',
        transform: 'scale(0.8)',
    },
    title: {
        fontSize: 14,
    },
    pos: {
        marginBottom: 12,
    },
}));

function LoveCaliculator(props) {

    const [names, setNames] = useState({});
    const [caliculatedPercentage, setPercentage] = useState({});
    const [openDialog, handleDialog] = useState(false);
    const [isLoading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const classes = useStyles();

    useEffect(() => {
        setPercentage({});
    }, [])

    const handleClickCaliculate = async (event) => {
        event.preventDefault();

        if ((Object.keys(names).length !== 2)) {
            setError('Please Enter the names in the Fields');
            return;
        }
        try {
            handleDialog(true)
            setLoading(true);
            setError('');
            await axios({
                "method": "GET",
                "url": "https://love-calculator.p.rapidapi.com/getPercentage",
                "headers": {
                    "content-type": "application/octet-stream",
                    "x-rapidapi-host": "love-calculator.p.rapidapi.com",
                    "x-rapidapi-key": "b894e4db39msh1c52ce42f10502ap18b3c9jsna227a50b18d4",
                    "useQueryString": true
                }, "params": {
                    "fname": names.mname,
                    "sname": names.fname
                }
            })
                .then((response) => {
                    console.log(response)
                    setLoading(false);
                    const { fname, sname, percentage, result } = response.data;
                    setPercentage({ fname, sname, percentage, result })
                    setNames({ mname: '', fname: '' });
                })
                .catch((error) => {
                    console.log(error)
                    handleDialog(false);
                    setLoading(false);
                })
        } catch (error) {
            console.error(error);
            handleDialog(false);
            setLoading(false);

        }
    }

    return (
        <div>
            <img className={classes.buttonStyle} src={love} alt="love-img" width={400} height={200} />
            <form>
                <FormControl className={classes.inputStyle}>
                    <InputLabel htmlFor="input-with-icon-adornment">Male Name</InputLabel>
                    <Input
                        id="input-with-icon-adornment"
                        startAdornment={
                            <InputAdornment position="start">
                                <AccountCircle />
                            </InputAdornment>
                        }
                        value={names.mname}
                        onChange={(event) => setNames({ ...names, mname: event.target.value })}
                    />
                </FormControl>
                <FormControl className={classes.inputStyle}>
                    <InputLabel htmlFor="input-with-icon-adornment">Fe-Male Name</InputLabel>
                    <Input
                        id="input-with-icon-adornment"
                        startAdornment={
                            <InputAdornment position="start">
                                <AccountCircle />
                            </InputAdornment>
                        }
                        value={names.fname}
                        onChange={(event) => setNames({ ...names, fname: event.target.value })}
                    />
                </FormControl>
                <div className={classes.buttonStyle}>
                    <Button
                        className={classes.buttonCss}
                        variant="contained"
                        color="primary"
                        type="submit"
                        onClick={(event) => handleClickCaliculate(event)}
                    >
                        Caliculate
                    </Button>
                </div>
            </form>
            <span>{error}</span>
            {isLoading ? <CircularProgress className={classes.buttonStyle} color="secondary" /> :
                <Dialog
                    open={openDialog}
                    TransitionComponent={Transition}
                    keepMounted
                    aria-labelledby="alert-dialog-slide-title"
                    aria-describedby="alert-dialog-slide-description"
                    onClose={() => handleDialog(false)}
                >
                    <DialogTitle id="alert-dialog-slide-title">{`Here Is Your Love Caliculation ...!`}</DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-slide-description">
                            Male Name : <span>{caliculatedPercentage.fname}</span>
                        </DialogContentText>
                        <DialogContentText id="alert-dialog-slide-description">
                            Fe-male Name : <span>{caliculatedPercentage.sname}</span>
                        </DialogContentText>
                        <DialogContentText id="alert-dialog-slide-description">
                            Love Percentage : <span>{`${caliculatedPercentage.percentage}%`}</span>
                        </DialogContentText>
                        <DialogContentText id="alert-dialog-slide-description">
                            Quote : <span>"{caliculatedPercentage.result}"</span>
                        </DialogContentText>
                    </DialogContent>
                </Dialog>
            }
        </div >
    )
};


export default LoveCaliculator;