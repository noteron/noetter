import React, { useMemo, useCallback, useContext } from "react";
import {
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  makeStyles,
  createStyles,
  Theme
} from "@material-ui/core";
import { Label, Settings } from "@material-ui/icons";
import NoteManagementContext from "../note-management/contexts/note-management-context";
import { BackgroundColor } from "../../../colors";

type Props = {
  onSettingsClick: () => void;
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
      height: "100%",
      display: "flex",
      flexDirection: "column"
    },
    nested: {
      paddingLeft: theme.spacing(4)
    },
    tagsTree: {
      overflowY: "auto",
      flex: 1,
      overflowX: "hidden",
      backgroundColor: BackgroundColor.tagTree
    },
    header: {
      backgroundColor: BackgroundColor.toolbar,
      borderWidth: "0 0 1px 0",
      borderStyle: "solid",
      borderColor: BackgroundColor.border
    },
    footer: {
      backgroundColor: BackgroundColor.toolbar,
      borderWidth: "1px 0 0 0",
      borderStyle: "solid",
      borderColor: BackgroundColor.border
    }
  })
);

const TagsTree = ({ onSettingsClick }: Props): JSX.Element => {
  const classes = useStyles();
  const { selectTags, allAvailableNotes, selectedTags } = useContext(
    NoteManagementContext
  );

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
    return (allAvailableNotes ?? []).reduce<TagNode[]>(
      (rootNodes, current): TagNode[] => {
        current.tags.forEach((tagString): void => {
          const tagStringList = tagString.split("/");
          if (!tagStringList.length) return;
          updateNodeListWithMatchingTags(rootNodes, tagStringList);
        });
        return rootNodes;
      },
      []
    );
  }, [allAvailableNotes, updateNodeListWithMatchingTags]);

  const isSelectedAndLastInTagsList = useCallback(
    (
      node: TagNode,
      selectedTagsList: string[] | undefined
    ): { match: boolean; exact: boolean } => {
      if (!selectedTagsList) return { match: false, exact: false };
      return {
        match: selectedTagsList[0] === node.name,
        exact:
          selectedTagsList[0] === node.name && selectedTagsList.length === 1
      };
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
      const selected = isSelectedAndLastInTagsList(node, selectedTagsList);
      return (
        <React.Fragment key={node.name}>
          <ListItem
            key={node.name}
            selected={selected.exact}
            button
            style={{
              paddingLeft: 16 + 16 * level
            }}
            onClick={() => {
              if (selectTags) selectTags([...(parentNames ?? []), node.name]);
            }}
          >
            <ListItemText primary={node.name.length ? node.name : "Untagged"} />
          </ListItem>
          {node.children && (
            <List disablePadding dense>
              {node.children.map((c) => {
                if (
                  selected.match &&
                  !selected.exact &&
                  selectedTagsList?.length
                ) {
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
    [isSelectedAndLastInTagsList, selectTags]
  );

  const memoizedTagsList = useMemo<JSX.Element[]>(
    () => tags.map((t) => renderTagNode(t, 0, selectedTags)),
    [renderTagNode, selectedTags, tags]
  );

  return (
    <div className={classes.root}>
      <List disablePadding className={classes.header}>
        <ListItem>
          <ListItemIcon>
            <Label />
          </ListItemIcon>
          <ListItemText primary="Tags" />
        </ListItem>
      </List>
      <List disablePadding dense className={classes.tagsTree}>
        {memoizedTagsList}
      </List>
      <List disablePadding className={classes.footer}>
        <ListItem button onClick={onSettingsClick}>
          <ListItemIcon>
            <Settings />
          </ListItemIcon>
          <ListItemText primary="Settings" />
        </ListItem>
      </List>
    </div>
  );
};

export default TagsTree;
