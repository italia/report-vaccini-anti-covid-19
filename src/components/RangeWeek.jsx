import React, { useEffect, useRef, useState } from "react";
import "../App.css";
import { Range, getTrackBackground } from "react-range";

export const RangeWeek = ({
    from,
    to,
    min,
    max,
    changeFrom,
    changeTo
  }) => {

  const myRef = useRef();
  const divRef = useRef();

  const [values, setValues] = useState([0, 1]);

  const STEP = 1;

  useEffect(() => {
    setValues([from, to])
  },[from, to, min, max]);


  return (
    <div className="col-12"
      style={{
        display: 'flex',
        justifyContent: 'center',
        flexWrap: 'wrap',
        backgroundColor: 'rgb(15, 53, 89)'
      }}
    >
      <Range
        draggableTrack
        values={values}
        step={STEP}
        min={min}
        max={max}
        rtl={false}
        onChange={(values) => {
          if (values[0] != values[1]) {
            setValues(values);
            changeFrom(values[0]);
            changeTo(values[1]);
          }

        }}
        renderTrack={({ props, children }) => (
          <div
            onMouseDown={props.onMouseDown}
            onTouchStart={props.onTouchStart}
            style={{
              ...props.style,
              height: '36px',
              display: 'flex',
              width: '100%',
              marginRight: 10,
              marginLeft: 10
            }}
          >
            <div
              ref={props.ref}
              style={{
                height: '5px',
                width: '100%',
                borderRadius: '4px',
                background: getTrackBackground({
                  values,
                  colors: ['#ccc', 'black', '#ccc'],
                  min: min,
                  max: max,
                  rtl: false
                }),
                alignSelf: 'center'
              }}
            >
              {children}
            </div>
          </div>
        )}
        renderThumb={({ props, isDragged }) => (
          <div
            {...props}
            style={{
              ...props.style,
              height: '20px',
              width: '20px',
              borderRadius: '50%',
              backgroundColor: '#ccc',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              boxShadow: '0px 2px 6px #AAA'
            }}
          >
          </div>
        )}
      />
    </div>
  );
};
