import React from 'react';

const Result = (props) => {
    let src = props.src || 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Article_icon_cropped.svg/512px-Article_icon_cropped.svg.png';
    let style = {
        backgroundImage: 'url('+src+')'
    }
    return (
        <a href={props.url} target="_blank" className='a-result'>
            <div className='result'>
                <div className='image' style={style}>
                    {/*<img src={src} className={imgClass} />*/}
                </div>
                <div className='stacked'>
                    <h3>{props.title}</h3>
                    <div>
                        <div>
                            <p className='truncate'>{props.url}</p>
                        </div>
                        <div className='description'>{props.description}</div>
                    </div>
                </div>
            </div>
        </a>
    )
}

export default Result;