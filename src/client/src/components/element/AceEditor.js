import React, { Component, PropTypes } from 'react';

class AceEditor extends Component {

    constructor(props) {
        super(props);
        this.checkEditor = this.checkEditor.bind(this);
        this.getSourceCode = this.getSourceCode.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleFocus = this.handleFocus.bind(this);
        this.handleBlur = this.handleBlur.bind(this);
    }

    checkEditor(sourceCode) {
        if (!this.editor) {
            //
            let domNode = this.refs.editorElement;
            this.editor = ace.edit(domNode);
            this.editor.getSession().setMode(this.props.mode);
            this.editor.getSession().setTabSize(4);
            if(this.props.isReadOnly){
                this.editor.setReadOnly(true);
            }
            this.editor.$blockScrolling = Infinity;
            this.editor.getSession().on('change', this.handleChange);
            this.editor.on('blur', this.handleBlur);
            this.editor.on('focus', this.handleFocus);
            this.isFocused = false;
        }
        if (sourceCode) {
            this.editor.getSession().setValue(sourceCode);
        }
        //this.editor.focus();
        //this.editor.navigateFileEnd();
    }

    getSourceCode(){
        if(this.editor){
            return this.editor.getSession().getValue();
        }
        return null;
    }

    handleChange(e){
        if(this.isFocused && this.props.onChangeText){
            this.props.onChangeText(this.editor.getSession().getValue());
        }
    }

    handleFocus(){
        this.isFocused = true;
    }

    handleBlur(){
        this.isFocused = false;
    }

    componentDidMount(){
        this.checkEditor(this.props.sourceCode);
    }

    componentDidUpdate(){
        this.checkEditor(this.props.sourceCode);
    }

    shouldComponentUpdate(nextProps, nextState){
        return !this.isFocused;
    }

    componentWillUnmount(){
        if(this.editor){
            this.editor.destroy();
            this.editor = null;
        }
    }

    render() {
        return (
            <div ref="editorElement" {...this.props}></div>
        );
    }

}

AceEditor.propTypes = {
    mode: PropTypes.string.isRequired,
    onChangeText: PropTypes.func
};

AceEditor.defaultProps = {
    mode: "ace/mode/javascript"
};

export default AceEditor;

