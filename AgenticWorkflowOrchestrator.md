# Directed Graph vs. Finite State Machine (FSM)

This summary compares and contrasts the concepts of **Directed Graphs** and **Finite State Machines (FSMs)**, explaining their structures, components, purposes, properties, and key differences.

---

## Directed Graph

### Structure
A **directed graph** (also known as a *digraph*) is a collection of nodes connected by edges, where each edge has a specific direction. That is, every edge points from one node (the start) to another node (the end), indicating a directional relationship between the nodes.

### Components
- **Nodes (Vertices):**  
  These represent the individual entities or points within the graph.
- **Edges (Arcs):**  
  These are directed connections between nodes, signifying a one-way relationship from one node to another.

### Purpose
Directed graphs are used to model scenarios where directionality of relationships is important. Common examples include:
- Web page links (where one page links to another)
- Social media connections (such as following relationships on Twitter)
- Network flows (like routes in transportation or data networks)

### Properties
- **Cycles:**  
  Directed graphs can contain cycles, which are paths that start and end at the same node.
- **No Inherent State or Input-Based Transitions:**  
  Directed graphs are purely structural and do not include concepts like state, input, or transitions triggered by events.

---

## Finite State Machine (FSM)

### Structure
A **Finite State Machine** is a computational model characterized by a finite set of states, transitions between these states, and associated actions. While an FSM can be visually represented as a directed graph, it brings additional semantics related to computational behavior.

### Components
- **States:**  
  Represent the various conditions or statuses that the system can be in.
- **Transitions:**  
  Directed edges that represent possible changes from one state to another, typically triggered by specific events or conditions.
- **Inputs/Outputs:**  
  FSMs often accept inputs that trigger transitions, and may produce outputs as a result of these transitions or upon entering certain states.

### Purpose
FSMs are used to model systems that have a limited number of distinct states and predictable, rule-based transitions between those states. Typical use cases include:
- Control systems (e.g., traffic lights)
- User interfaces (e.g., menu navigation)
- Protocol designs (e.g., networking protocols)

### Properties
- **Determinism:**  
  FSMs can be deterministic (DFSM), where each input leads to exactly one transition, or non-deterministic (NFSM), where multiple transitions may be possible.
- **Actions/Outputs:**  
  FSMs may associate actions or outputs with either transitions or states.
- **Behavior Modeling:**  
  FSMs are designed to describe how a system behaves and evolves over time in response to inputs.

---

## Key Differences

| Aspect      | Directed Graph                    | Finite State Machine (FSM)                   |
|-------------|-----------------------------------|----------------------------------------------|
| **Purpose** | General model for any directional relationship. | Models state-based systems with transitions. |
| **Components** | Nodes and directed edges only. | States, transitions, inputs, outputs.        |
| **Behavior** | No inherent concept of behavior or state changes. | Describes system behavior and state changes in response to inputs. |

**Summary:**  
- **Directed graphs** are general-purpose structures for representing directional relationships.
- **FSMs** are specialized computational models for systems with a finite number of states and defined transition rules, often used to model dynamic behaviors.
