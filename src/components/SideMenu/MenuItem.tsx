import { observer } from 'mobx-react';
import * as React from 'react';

import { ShelfIcon } from '../../common-elements/shelfs';
import { CloseIcon } from '../../common-elements/close';
import { GROUP_DEPTH, IMenuItem, OperationModel, RedocNormalizedOptions } from '../../services';
import { shortenHTTPVerb } from '../../utils/openapi';
import { MenuItems } from './MenuItems';
import { MenuItemLabel, MenuItemLi, MenuItemTitle, OperationBadge } from './styled.elements';

export interface MenuItemProps {
  item: IMenuItem;
  onActivate?: (item: IMenuItem) => void;
  withoutChildren?: boolean;
  options: RedocNormalizedOptions;
}

@observer
export class MenuItem extends React.Component<MenuItemProps> {
  ref: Element | null;

  activate = (evt: React.MouseEvent<HTMLElement>) => {
    this.props.onActivate!(this.props.item);
    evt.stopPropagation();
  };

  componentDidMount() {
    this.scrollIntoViewIfActive();
  }

  componentDidUpdate() {
    this.scrollIntoViewIfActive();
  }

  scrollIntoViewIfActive() {
    if (this.props.item.active && this.ref) {
      this.ref.scrollIntoViewIfNeeded();
    }
  }

  saveRef = ref => {
    this.ref = ref;
  };

  render() {
    const { item, withoutChildren } = this.props;
    return (
      <MenuItemLi
        onClick={this.activate}
        depth={item.depth}
        type={item.type}
        ref={this.saveRef}
        data-item-id={item.id}
      >
        {item.type === 'operation' ? (
          <OperationMenuItemContent {...this.props} item={item as OperationModel} />
        ) : (
          <MenuItemLabel depth={item.depth} active={item.active} type={item.type}>
            <MenuItemTitle title={item.name}>
              {item.name}
              {this.props.children}
            </MenuItemTitle>
            {((item.depth >= 0 ||
              (item.depth === GROUP_DEPTH && this.props.options.collapseTagGroups)) &&
              item.items.length > 0 && (
                <ShelfIcon
                  float={'right'}
                  direction={item.expanded ? 'down' : 'right'}
                  color={'white'}
                />
              )) ||
              null}
          </MenuItemLabel>
        )}
        {!withoutChildren && item.items && item.items.length > 0 && (
          <MenuItems
            expanded={item.expanded}
            items={item.items}
            onActivate={this.props.onActivate}
            options={this.props.options}
          />
        )}
      </MenuItemLi>
    );
  }
}

export interface OperationMenuItemContentProps {
  item: OperationModel;
  options: RedocNormalizedOptions;
}

@observer
class OperationMenuItemContent extends React.Component<OperationMenuItemContentProps> {
  render() {
    const { item } = this.props;
    return (
      <MenuItemLabel depth={item.depth} active={item.active} deprecated={item.deprecated}>
        <OperationBadge type={item.httpVerb}>{shortenHTTPVerb(item.httpVerb)}</OperationBadge>
        <MenuItemTitle width="calc(100% - 38px)">
          {item.name}
          {this.props.children}
        </MenuItemTitle>
        {this.props.options.canSaved && (
          <CloseIcon
            color="error"
            handleClick={() => {
              this.props.options?.deleteItem(item);
            }}
          />
        )}
      </MenuItemLabel>
    );
  }
}
