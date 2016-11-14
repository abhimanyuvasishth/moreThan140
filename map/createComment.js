

class CommentBoard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {name: '',
                  value: '',
                  comments: []
    };

    this.handleChangeName = this.handleChangeName.bind(this);
    this.handleChangeText = this.handleChangeText.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChangeName(event) {
    this.setState({name: event.target.value});
  }

  handleChangeText(event) {
    this.setState({value: event.target.value});
  }

  handleSubmit(event) {
    var name = this.state.name;
    var text = this.state.value;

    if(text !== ''){
      if(name==="")
        name = 'anonymous';

      var arr = this.state.comments;
          arr.unshift({
              name: name,
              comment: text
          });
      this.setState({comments: arr});
      event.preventDefault();
    }
    event.preventDefault();
  }

  render() {
    var comments  = this.state.comments;
    var d = new Date();
    var month = d.getMonth()+1;
    var date = d.getDate() +'/'+ month + '/'+ d.getFullYear();
        var commentTemplate  = comments.map(function(item, index)  {
            return  (
                <div  key={index}>
                    <div className="comment">
                      <p>{item.comment}</p>
                      <p id="date">By {item.name} {date}</p>
                    </div>
                    <div className="padding"></div> 

                </div>
            )
        })
    return (
      <div className="commentBox">
        <form className="pure-form pure-g" onSubmit={this.handleSubmit}>
          
           <div className="pure-u-1-8">
              <input className="pure-input-1" id="name" type="text" placeholder="Name" value={this.state.name} onChange={this.handleChangeName} />
          </div>
          <div className="pure-u-3-4">
              <input className="pure-input-1" type="text" placeholder="Leave your comment" value={this.state.value} onChange={this.handleChangeText} />
          </div>
            
            <input className="pure-button" type="submit" value="Submit" />
        </form>

            <div className="padding"></div>

            {commentTemplate}
            <div className="padding"></div>
            <div className="padding"></div>



      </div>
    );
  }
}



ReactDOM.render(<CommentBoard/>, document.getElementById("app"));

