import React from "react";
import { Menu, Item, Separator, Submenu, useContextMenu, TriggerEvent } from 'react-contexify';
import 'react-contexify/dist/ReactContexify.css';

interface Props {
    event?: React.MouseEvent;
    x: number;
    y: number;
}

export const AttendeeMenu: React.FC<Props> = (props) => {

    const MENU_ID = 'attendeeMenu';
    const contextMenu = useContextMenu({ id: MENU_ID });

    const handleItemClick = (e: any) => console.log(e);


    React.useEffect(() => {
        console.log("EVENT CHANGED");
        if (props.event !== undefined && props.event !== null) {
            console.log("PAGE X");
            console.log(props.x);
            contextMenu.hideAll();
            contextMenu.show(props.event, {
                position: {
                    x: props.x - 200,
                    y: props.y
                }
            });
        }
    }, [props.event, props.x, props.y]);

    return (
        <Menu id={MENU_ID}>
            <Item onClick={handleItemClick}>Item 1</Item>
            <Item onClick={handleItemClick}>Item 2</Item>
            <Separator />
            <Item disabled>Disabled</Item>
            <Separator />
            <Submenu label="Foobar">
                <Item onClick={handleItemClick}>Sub Item 1</Item>
                <Item onClick={handleItemClick}>Sub Item 2</Item>
            </Submenu>
        </Menu>
    );
}




