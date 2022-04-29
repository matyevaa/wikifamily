import React from "react";
import Tree from "react-d3-tree";
import clone from "clone";


export default class CenteredTree extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      db_data: this.props.dataDB,
      visibility: false,
      data: [],
    }
    this.showTree = this.showTree.bind(this);
    console.log("db ", this.state.db_data);
  }

  injectedNodesCount = 0;

  addChildNode = () => {
    const nextData = clone(this.state.data);
    const target = nextData.children;
    this.injectedNodesCount++;
    target.push({
      name: `Inserted Node ${this.injectedNodesCount}`,
      id: `inserted-node-${this.injectedNodesCount}`
    });
    this.setState({
      data: nextData
    });
  };

  removeChildNode = () => {
    const nextData = clone(this.state.data);
    const target = nextData.children;
    target.pop();
    this.injectedNodesCount--;
    this.setState({
      data: nextData
    });
  };

  traverse = (kids, x, idx) => {
   var children_array = [];
   if(kids) {
     children_array.push(kids.map( (kid ) => ({
       id: x = ++x,
       name: kid.first_name,
       children: kid.children ? this.traverse(kid.children, x) : null
     })) )
   }
   return children_array.reverse()[0];
 }

  showTree = () => {
    const { visibility } = this.state;
    const items = this.state.db_data[0];
    var x = 0;
    console.log("items", items.first_name);
    const data = [{
      id: x,
      name: items.first_name, // parent #1
      children: items.children.map( (child, idx) => ({
          id: x = ++idx,
          name: child.first_name, // child of parent #1
          children: child.children ? this.traverse(child.children, x, idx) : null
        }))
    }]

    this.setState({
      visibility: !visibility,
      data: data
    })
  }


  componentDidMount(prevProps) {
    // Get treeContainer's dimensions so we can center the tree
    const dimensions = this.treeContainer.getBoundingClientRect();
    this.setState({
      translate: {
        x: dimensions.width / 2,
        y: dimensions.height / 2
      }
    });
    // get props dataDB from Create.js, db data is stored there

  }

  render() {
    const { visibility } = this.state;

    if(this.state.data === '') {
      return <div>Loading</div>
    }
    else {
      return (
        <div className="containerStyles" ref={tc => (this.treeContainer = tc)}>
          <div className="showTreeContainer">
            <button className="graphBtn" id="showTree" onClick={this.showTree}> {this.state.visibility ? "Close Tree" : "Show Tree"}</button>
          </div>
          <div className="graphBtnContainer">
            <button className="graphBtn" id="addGraphNode" onClick={this.addChildNode}>Add Node</button>
            <button className="graphBtn" onClick={this.removeChildNode}>Remove Node</button>
          </div>
          {visibility ?
            <Tree
              data={this.state.data}
              translate={this.state.translate}
              orientation={"vertical"}
            />
            : null }
        </div>
      );
    }
  }
}
