import React from "react";
import { Row, FormGroup, Col, InputGroup } from "react-bootstrap"
import { AdminServiceInterface, ApiHelper, InputBox, Duration } from ".";
import { DateHelper, UniqueIdHelper } from "../../../helpers";

interface Props { currentService: AdminServiceInterface, updatedFunction?: () => void }

export const ServiceEdit: React.FC<Props> = (props) => {
    const [currentService, setCurrentService] = React.useState<AdminServiceInterface>(null);
    const checkDelete = () => { if (!UniqueIdHelper.isMissing(currentService?.id)) return handleDelete; else return null; }
    const handleCancel = () => { props.updatedFunction(); }

    const handleDelete = () => {
        if (window.confirm("Are you sure you wish to delete this service?")) {
            ApiHelper.delete("/services/" + currentService.id, "StreamingLiveApi").then(() => { setCurrentService(null); props.updatedFunction(); });
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const val = e.currentTarget.value;
        var s = { ...currentService };
        switch (e.currentTarget.name) {
            case "serviceLabel": s.label = val; break;
            case "serviceTime":
                var date = new Date(val);
                s.serviceTime = date;
                break;
            case "chatBefore": s.chatBefore = parseInt(val) * 60; break;
            case "chatAfter": s.chatAfter = parseInt(val) * 60; break;
            case "provider": s.provider = val; break;
            case "providerKey": s.providerKey = val; break;
            case "recurs": s.recurring = val === "true"; break;
        }
        setCurrentService(s);
    }

    const handleSave = () => {
        setVideoUrl();
        console.log(JSON.stringify(currentService));
        ApiHelper.post("/services", [currentService], "StreamingLiveApi").then(props.updatedFunction);
    }

    const setVideoUrl = () => {
        var result = currentService?.providerKey;
        switch (currentService?.provider) {
            case "youtube_live":
            case "youtube_watchparty":
                result = "https://www.youtube.com/embed/" + currentService?.providerKey + "?autoplay=1&controls=0&showinfo=0&rel=0&modestbranding=1&disablekb=1";
                break;
            case "vimeo_live":
            case "vimeo_watchparty":
                result = "https://player.vimeo.com/video/" + currentService?.providerKey + "?autoplay=1";
                break;
            case "facebook_live":
                result = "https://www.facebook.com/plugins/video.php?href=https%3A%2F%2Fwww.facebook.com%2Fvideo.php%3Fv%3D" + currentService?.providerKey + "&show_text=0&autoplay=1&allowFullScreen=1";
                break;
        }
        return currentService.videoUrl = result;
    }


    React.useEffect(() => { setCurrentService(props.currentService); }, [props.currentService]);

    var keyLabel = <>Video Embed Url</>;
    var keyPlaceholder = "https://yourprovider.com/yoururl/"

    switch (currentService?.provider) {
        case "youtube_live":
        case "youtube_watchparty":
            keyLabel = <>YouTube ID <span className="description">https://youtube.com/watch?v=<b>abcd1234</b></span></>;
            keyPlaceholder = "abcd1234";
            break;
        case "vimeo_live":
        case "vimeo_watchparty":
            keyLabel = <>Vimeo ID <span className="description">https://vimeo.com/<b>123456789</b></span></>;
            keyPlaceholder = "123456789";
            break;
        case "facebook_live":
            keyLabel = <>Video ID <span className="description">https://facebook.com/video.php?v=<b>123456789</b></span></>;
            keyPlaceholder = "123456789";
            break;
    }



    var localServiceTime = currentService?.serviceTime;
    return (
        <InputBox headerIcon="far fa-calendar-alt" headerText="Edit Service" saveFunction={handleSave} cancelFunction={handleCancel} deleteFunction={checkDelete()} >
            <Row>
                <Col>
                    <FormGroup>
                        <label>Service Name</label>
                        <input type="text" className="form-control" name="serviceLabel" value={currentService?.label} onChange={handleChange} />
                    </FormGroup>
                </Col>
            </Row>
            <Row>
                <Col>
                    <FormGroup>
                        <label>Service Time</label>
                        <input type="datetime-local" className="form-control" name="serviceTime" defaultValue={DateHelper.formatHtml5DateTime(localServiceTime)} onChange={handleChange} />
                    </FormGroup>
                </Col>
                <Col>
                    <FormGroup>
                        <label>Recurs Weekly</label>
                        <select className="form-control" name="recurs" value={Boolean(currentService?.recurring).toString()} onChange={handleChange} >
                            <option value="false">No</option>
                            <option value="true">Yes</option>
                        </select>
                    </FormGroup>
                </Col>

            </Row>

            <Row>
                <Col>
                    <FormGroup>
                        <label>Total Service Duration</label>
                        <Duration totalSeconds={currentService?.duration} updatedFunction={totalSeconds => { var s = { ...currentService }; s.duration = totalSeconds; setCurrentService(s); }} />
                    </FormGroup>
                </Col>
                <Col>
                    <FormGroup>
                        <label>Start Video Early <span className="description"> (Optional) For countdowns</span></label>
                        <Duration totalSeconds={currentService?.earlyStart} updatedFunction={totalSeconds => { var s = { ...currentService }; s.earlyStart = totalSeconds; setCurrentService(s); }} />
                    </FormGroup>
                </Col>
            </Row>
            <Row>
                <Col>
                    <FormGroup>
                        <label>Enable Chat and Prayer</label>
                        <Row>
                            <Col>
                                <InputGroup>
                                    <input type="number" className="form-control" min="0" step="1" name="chatBefore" value={currentService?.chatBefore / 60} onChange={handleChange} />
                                    <div className="input-group-append"><label className="input-group-text">min before</label></div>
                                </InputGroup>
                            </Col>
                            <Col>
                                <InputGroup>
                                    <input type="number" className="form-control" min="0" step="1" name="chatAfter" value={currentService?.chatAfter / 60} onChange={handleChange} />
                                    <div className="input-group-append"><label className="input-group-text">min after</label></div>
                                </InputGroup>
                            </Col>
                        </Row>
                    </FormGroup>
                </Col>

            </Row>
            <Row>
                <Col>
                    <FormGroup>
                        <label>Video Provider</label>
                        <select id="Provider" className="form-control" name="provider" value={currentService?.provider} onChange={handleChange} >
                            <optgroup label="Live Stream">
                                <option value="youtube_live">YouTube</option>
                                <option value="vimeo_live">Vimeo</option>
                                <option value="facebook_live">Facebook</option>
                                <option value="custom_live">Custom Embed Url</option>
                            </optgroup>
                            <optgroup label="Prerecorded Watchparty">
                                <option value="youtube_watchparty">YouTube</option>
                                <option value="vimeo_watchparty">Vimeo</option>
                                <option value="custom_watchparty">Custom Embed Url</option>
                            </optgroup>
                        </select>
                    </FormGroup>
                </Col>
                <Col>
                    <FormGroup>
                        <label id="videoKeyLabel">{keyLabel}</label>
                        <input id="videoKeyText" type="text" className="form-control" name="providerKey" value={currentService?.providerKey} onChange={handleChange} placeholder={keyPlaceholder} />
                    </FormGroup>
                </Col>
            </Row>

        </InputBox>
    );
}
