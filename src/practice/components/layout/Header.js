import React from "react";

function Header() {
    return (
        <div className="ChannelInfo">
            <div className="Topic">
                Channel Status: <input className="TopicInput" value="Open" />
            </div>
            <div className="ChannelName">@</div>
        </div>
    );
}

export default Header;
