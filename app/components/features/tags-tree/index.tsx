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
};

type Node = {
  name: string;
  children?: Node[];
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

const TagsTree = ({ files }: Props): JSX.Element => {
  const classes = useStyles();

  const createNodeTreeFromTagListOnly = useCallback(
    (tagsList: string[]): Node => {
      const [head, ...rest] = tagsList;
      return {
        name: head,
        children: rest.length
          ? [createNodeTreeFromTagListOnly(rest)]
          : undefined
      };
    },
    []
  );

  const updateNodeListWithMatchingTags = useCallback(
    (nodeList: Node[], tagsList: string[]): void => {
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
    [createNodeTreeFromTagListOnly]
  );

  const tags = useMemo<Node[]>(() => {
    return files.reduce<Node[]>((rootNodes, current): Node[] => {
      current.tags.forEach((tagString): void => {
        const tagStringList = tagString.split("/");
        if (!tagStringList.length) return;
        updateNodeListWithMatchingTags(rootNodes, tagStringList);
      });
      return rootNodes;
    }, []);
  }, [files, updateNodeListWithMatchingTags]);

  const renderTagNode = useCallback(
    (node: Node, indented?: boolean): JSX.Element => (
      <React.Fragment key={node.name}>
        <ListItem
          key={node.name}
          className={indented ? classes.nested : undefined}
        >
          <ListItemText primary={node.name} />
        </ListItem>
        {node.children && (
          <List
            disablePadding
            dense
            className={indented ? classes.nested : undefined}
          >
            {node.children.map((c) => renderTagNode(c, true))}
          </List>
        )}
      </React.Fragment>
    ),
    [classes.nested]
  );

  const memoizedTagsList = useMemo<JSX.Element[]>(
    () => tags.map((t) => renderTagNode(t)),
    [renderTagNode, tags]
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
