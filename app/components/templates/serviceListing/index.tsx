import React from 'react'
import { SMALL_SLIDER_NO_IMAGE } from "@constant/noImage";

function ServiceListing({ servicesList }) {
    return (
        <div>
            <div className="servoption-list-cover">
                <div className="servoption-cover">
                    <div className="servoption-left">
                        <div className="servoption-img-cover">
                            <img src={SMALL_SLIDER_NO_IMAGE} />
                        </div>
                    </div>
                    <div className="servoption-right">
                        <div className="servoption-name">Hair Designing</div>
                    </div>
                </div>
                <div className="servoption-cover">
                    <div className="servoption-left">
                        <div className="servoption-img-cover">
                            <img src={SMALL_SLIDER_NO_IMAGE} />
                        </div>
                    </div>
                    <div className="servoption-right">
                        <div className="servoption-name">Hair Designing</div>
                    </div>
                </div>
                <div className="servoption-cover">
                    <div className="servoption-left">
                        <div className="servoption-img-cover">
                            <img src={SMALL_SLIDER_NO_IMAGE} />
                        </div>
                    </div>
                    <div className="servoption-right">
                        <div className="servoption-name">Hair Designing</div>
                    </div>
                </div>
                <div className="servoption-cover">
                    <div className="servoption-left">
                        <div className="servoption-img-cover">
                            <img src={SMALL_SLIDER_NO_IMAGE} />
                        </div>
                    </div>
                    <div className="servoption-right">
                        <div className="servoption-name">Hair Designing</div>
                    </div>
                </div>
                <div className="servoption-cover">
                    <div className="servoption-left">
                        <div className="servoption-img-cover">
                            <img src={SMALL_SLIDER_NO_IMAGE} />
                        </div>
                    </div>
                    <div className="servoption-right">
                        <div className="servoption-name">Hair Designing</div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ServiceListing
