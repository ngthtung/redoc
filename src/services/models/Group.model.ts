import { action, observable } from 'mobx';

import { OpenAPIExternalDocumentation, OpenAPITag } from '../../types';
import { safeSlugify } from '../../utils';
import { MarkdownHeading, MarkdownRenderer } from '../MarkdownRenderer';
import { ContentItemModel } from '../MenuBuilder';
import { IMenuItem, MenuItemGroupType } from '../MenuStore';
import { RedocNormalizedOptions } from '..';

/**
 * Operations Group model ready to be used by components
 */
export class GroupModel implements IMenuItem {
  //#region IMenuItem fields
  id: string;
  absoluteIdx?: number;
  name: string;
  description?: string;
  type: MenuItemGroupType;
  options: RedocNormalizedOptions;

  items: ContentItemModel[] = [];
  parent?: GroupModel;
  externalDocs?: OpenAPIExternalDocumentation;

  @observable
  active: boolean = false;
  @observable
  expanded: boolean = false;

  depth: number;
  level: number;
  //#endregion

  constructor(
    type: MenuItemGroupType,
    tagOrGroup: OpenAPITag | MarkdownHeading,
    options: RedocNormalizedOptions,
    parent?: GroupModel,
  ) {
    // markdown headings already have ids calculated as they are needed for heading anchors
    this.id = (tagOrGroup as MarkdownHeading).id || type + '/' + safeSlugify(tagOrGroup.name);
    this.type = type;
    this.name = tagOrGroup['x-displayName'] || tagOrGroup.name;
    this.level = (tagOrGroup as MarkdownHeading).level || 1;
    this.options = options;
    // remove sections from markdown, same as in ApiInfo
    this.description = tagOrGroup.description || '';

    const items = (tagOrGroup as MarkdownHeading).items;
    if (items && items.length) {
      this.description = MarkdownRenderer.getTextBeforeHading(this.description, items[0].name);
    }

    this.parent = parent;
    this.externalDocs = (tagOrGroup as OpenAPITag).externalDocs;

    // groups are active (expanded) by default
    if (this.type === 'group' && !this.options.collapseTagGroups) {
      this.expanded = true;
    }
  }

  @action
  activate() {
    this.active = true;
  }

  @action
  expand() {
    if (this.parent) {
      this.parent.expand();
    }
    this.expanded = true;
  }

  @action
  collapse() {
    // disallow collapsing groups
    if (this.type === 'group' && !this.options.collapseTagGroups) {
      return;
    }
    this.expanded = false;
  }

  @action
  deactivate() {
    this.active = false;
  }
}
