import React, { useMemo, useCallback } from "react";
import {
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  makeStyles,
  createStyles,
  Theme
} from "@material-ui/core";
import { Label } from "@material-ui/icons";
import { FileDescription } from "../../hooks/use-file-reader";

type Props = {
  files: FileDescription[];
  selectedTags: string[] | undefined;
  onItemClick: (tagList: string[]) => void;
};

export type TagNode = {
  name: string;
  children?: TagNode[];
};

const createNodeTreeFromTagListOnly = (tagsList: string[]): TagNode => {
  const [head, ...rest] = tagsList;
  return {
    name: head,
    children: rest.length ? [createNodeTreeFromTagListOnly(rest)] : undefined
  };
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      backgroundColor: theme.palette.background.paper,
      height: "100%"
    },
    nested: {
      paddingLeft: theme.spacing(4)
    }
  })
);

const TagsTree = ({ files, selectedTags, onItemClick }: Props): JSX.Element => {
  const classes = useStyles();

  const updateNodeListWithMatchingTags = useCallback(
    (nodeList: TagNode[], tagsList: string[]): void => {
      // take first in list of tag parts
      const [head, ...rest] = tagsList;
      // check if it exists in list of nodes
      const matchingNode = nodeList.find((node) => node.name === head);
      // if it exists
      if (matchingNode) {
        // if there are not any more parts, there is nowhere else to go, return forEach iteration
        if (!rest.length) {
          return;
        }
        // run this method again on this matching nodes children and update in place
        if (rest.length) {
          // continue going through recursively in matching nodes children
          updateNodeListWithMatchingTags(matchingNode.children ?? [], rest);
          return;
        }
      }
      // no node with that name exists, add it
      nodeList.push({
        name: head,
        children: rest.length
          ? [createNodeTreeFromTagListOnly(rest)]
          : undefined
      });
    },
    []
  );

  const tags = useMemo<TagNode[]>(() => {
    return files.reduce<TagNode[]>((rootNodes, current): TagNode[] => {
      current.tags.forEach((tagString): void => {
        const tagStringList = tagString.split("/");
        if (!tagStringList.length) return;
        updateNodeListWithMatchingTags(rootNodes, tagStringList);
      });
      return rootNodes;
    }, []);
  }, [files, updateNodeListWithMatchingTags]);

  const isSelected = useCallback(
    (node: TagNode, selectedTagsList: string[] | undefined): boolean => {
      if (!selectedTagsList) return false;
      return selectedTagsList[0] === node.name;
    },
    []
  );

  const renderTagNode = useCallback(
    (
      node: TagNode,
      level: number,
      selectedTagsList: string[] | undefined,
      parentNames?: string[]
    ): JSX.Element => {
      const selected = isSelected(node, selectedTagsList);
      return (
        <React.Fragment key={node.name}>
          <ListItem
            key={node.name}
            className={level ? classes.nested : undefined}
            selected={selected}
            button
            onClick={() => onItemClick([...(parentNames ?? []), node.name])}
          >
            <ListItemText primary={node.name} />
          </ListItem>
          {node.children && (
            <List
              disablePadding
              dense
              className={level ? classes.nested : undefined}
            >
              {node.children.map((c) => {
                if (selected && selectedTagsList?.length) {
                  const [, ...restOfTags] = selectedTagsList;
                  return renderTagNode(c, level + 1, restOfTags, [
                    ...(parentNames ?? []),
                    node.name
                  ]);
                }
                return renderTagNode(c, level + 1, undefined, [
                  ...(parentNames ?? []),
                  node.name
                ]);
              })}
            </List>
          )}
        </React.Fragment>
      );
    },
    [classes.nested, isSelected, onItemClick]
  );

  const memoizedTagsList = useMemo<JSX.Element[]>(
    () => tags.map((t) => renderTagNode(t, 0, selectedTags)),
    [renderTagNode, selectedTags, tags]
  );

  return (
    <List className={classes.root} dense>
      <ListItem>
        <ListItemIcon>
          <Label />
        </ListItemIcon>
        <ListItemText primary="Tags" />
      </ListItem>
      {memoizedTagsList}
    </List>
  );
};

export default TagsTree;
