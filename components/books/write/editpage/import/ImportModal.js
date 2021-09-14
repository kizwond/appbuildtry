import React, { Component } from 'react';
import { Modal,Button } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import axios from 'axios'

class ImportModal extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            visiable:false,
            file:''
         }
    }

    showModal = () => {
        this.setState({
            visiable:true
        })
    };
    
    handleOk = () => {
        this.setState({
            visiable:false
        })
    };
    
    handleCancel = () => {
        this.setState({
            visiable:false
        })
    };
    uplodeFile = event =>{
        const mybook_id = sessionStorage.getItem("book_id")
        console.log(this.state.file)
        const data = new FormData();
        data.append("file", this.state.file)
        data.append("mybook_id", mybook_id)
        data.append("index_id", this.props.indexChanged)
        data.append("cardset_id", this.props.cardSetId)
        data.append("indexset_id", this.props.indexSetId)
        console.log(data)
        axios.post('http://localhost:5000/cardset_inspectExcelFileToImport', data)
          .then(res => {alert(res.data.msg); 
            this.setState({
            file:''
          })})
          .catch(err => console.log(err))
      }
    render() { 
        return ( 
            <>
            <Button type="default" size="small" onClick={this.showModal}>
                import <DownloadOutlined />
            </Button>
            <Modal footer={null} title="Basic Modal" width={800} visible={this.state.visiable} onOk={this.handleOk} onCancel={this.handleCancel}>
                <form action="#">
                    <input type="file" name="import_file" onChange={(event)=>{
                    const file = event.target.files[0];
                        this.setState({
                            file:file
                        })
                    }}/>
                </form>
              <Button size='small' onClick={this.uplodeFile}>파일업로드</Button>
            </Modal>
          </>
         );
    }
}
 
export default ImportModal;