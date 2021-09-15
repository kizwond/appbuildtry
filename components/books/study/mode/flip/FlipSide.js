import React, { Component } from 'react';
import Button from '../styledComponents/defaultButton'
import { MessageOutlined } from '@ant-design/icons';
import { Badge, Popover,Divider  } from 'antd';

class FlipSide extends Component {
    constructor(props) {
        super(props);
        this.state = {  }
    }
    render() { 
        if(this.props.card_status){
            const card = this.props.card_status.detail_status
            var level = card.level
            var total_study_times = card.total_study_times
            var exp_stacked = card.exp_stacked
            var recent_difficulty = card.recent_difficulty
            var total_study_hour = card.total_study_hour
            var session_study_times = card.session_study_times
            var exp_gained = card.exp_stacked
            var recent_study_hour = card.recent_study_hour
        }
        const content = (
            <div style={{fontSize:"11px",fontFamily:`"Noto Sans KR", sans-serif`}}>
                <div>
                    <p>이번세션 학습이력</p>
                    <p style={{marginLeft:"20px"}}>학습횟수 : {session_study_times}</p>
                    <p style={{marginLeft:"20px"}}>획득 경험치 : {exp_gained}</p>
                    <p style={{marginLeft:"20px"}}>학습시간 : {recent_study_hour}</p>
                </div>
                <Divider style={{margin:"5px"}} dashed />
                <div>
                    <p>총 학습이력</p>
                    <p style={{marginLeft:"20px"}}>총 학습횟수 : {total_study_times}</p>
                    <p style={{marginLeft:"20px"}}>총 획득 경험치 : {exp_stacked}</p>
                    <p style={{marginLeft:"20px"}}>총 학습시간 : {total_study_hour}</p>
                    <p style={{marginLeft:"20px"}}>최근 선택난이도 : {recent_difficulty}</p>
                </div>
            </div>
        );
        return ( 
            <>
            <div style={{display:"flex", flexDirection:"column", justifyContent:"space-between", height:"672px"}}>
                <div style={{display:"flex", flexDirection:"column", justifyContent:"space-between", height:"50px"}}>
                    <div>
                        <Badge size="small" style={{ backgroundColor: '#108ee9', fontSize:"9px" }} count={5}>
                            <MessageOutlined style={{cursor:"pointer", fontSize: '20px', color: '#8e8e8e' }}/>
                        </Badge> 
                    </div>
                    <div>
                    <Popover placement="bottomLeft" content={content} title={`level ${level}`} trigger="click">
                        <Button size="small" width="50px" style={{borderRadius:"10px"}}>Lev.{level}</Button>
                    </Popover>
                    </div>
                </div>
                <div style={{display:"flex", flexDirection:"column", justifyContent:"space-between", height:"50px"}}>
                    <div>
                        <Button size="small" width="100px" style={{borderRadius:"5px"}}>카드수정</Button>
                    </div>
                    <div>
                        <Button size="small" width="100px" style={{borderRadius:"5px"}}>새카드 추가</Button>
                    </div>
                </div>
            </div>
            </>
         );
    }
}
 
export default FlipSide;