var sl         = require('./'),
  EventQueue = require('./event_queue'),
  SweepLine  = require('./sweep_line');


function Polygon(point_array){
  this.vertices = point_array;
  this.self_intersection_lines = [];
};

Polygon.prototype.get_self_intersection_lines = function() {
  return(this.self_intersection_lines);
};

// Tests polygon simplicity. 
// returns true if simple, false if not.
Polygon.prototype.simple_polygon = function(){

  var event_queue  = new EventQueue(this);
  var sweep_line   = new SweepLine(this);

  this.self_intersection_lines = [];

  // This loop processes all events in the sorted queue
  // Events are only left or right vertices
  while (e = event_queue.events.shift()) { 
    if (e.type == 'left') {
      var s = sweep_line.add(e);           
      
      if (sweep_line.intersect(s, s.above)) {
        this.self_intersection_lines = [s, s.above];
        return false;         
      }              
      if (sweep_line.intersect(s, s.below)){
        this.self_intersection_lines = [s, s.below];
        return false;    
      }
                             
    } else {         
      var s = sweep_line.find(e);
      
      if (sweep_line.intersect(s.above, s.below)) {
        this.self_intersection_lines = [s.above, s.below];
        return false;                       
      }
      
      sweep_line.remove(s);                   
    }
  }
  return true;
};

module.exports = Polygon;