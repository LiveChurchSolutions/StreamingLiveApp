import React from "react";
import { Row, Col, InputGroup } from "react-bootstrap"

interface Props { totalSeconds: number, updatedFunction?: (totalSeconds: number) => void }

export const Duration: React.FC<Props> = (props) => {
  let min = Math.floor(props.totalSeconds / 60);
  let sec = props.totalSeconds - (min * 60);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.currentTarget.value);
    switch (e.currentTarget.name) {
      case "min": min = val; break;
      case "sec": sec = val; break;
    }
    const total = min * 60 + sec;
    props.updatedFunction(total);
  }

  return (
    <Row>
      <Col>
        <InputGroup>
          <input type="number" className="form-control" min="0" step="1" name="min" value={min} onChange={handleChange} />
          <div className="input-group-append"><label className="input-group-text">min</label></div>
        </InputGroup>
      </Col>
      <Col>
        <InputGroup>
          <input type="number" className="form-control" min="0" step="1" max="59" name="sec" value={sec} onChange={handleChange} />
          <div className="input-group-append"><label className="input-group-text">sec</label></div>
        </InputGroup>
      </Col>
    </Row>
  );
}
